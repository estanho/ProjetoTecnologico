"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripGenerateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const directions_service_1 = require("../../maps/directions/directions.service");
const tripsTime_service_1 = require("./tripsTime.service");
let TripGenerateService = class TripGenerateService {
    constructor(prismaService, directionsService, tripsTimeService) {
        this.prismaService = prismaService;
        this.directionsService = directionsService;
        this.tripsTimeService = tripsTimeService;
    }
    async intervalTrip(return_time, going_time) {
        try {
            const { routes, status } = await this.directionsService.getIntervalDirections(return_time.ordainedStudentsAll[return_time.ordainedStudentsAll.length - 1].address.place_id, going_time.ordainedStudentsAll[0].address.place_id);
            if (status !== 'OK') {
                throw new Error('Erro na Consulta');
            }
            const times = await this.tripsTimeService.checkIntervalTime(routes, return_time);
            return {
                error: false,
                times,
            };
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
    async generateTrip(user_id, shift, type) {
        try {
            let schoolWhere;
            if (shift === 'morning') {
                schoolWhere = {
                    status: true,
                    morning: true,
                    driver: {
                        user: {
                            id: user_id,
                        },
                    },
                };
            }
            else if (shift === 'afternoon') {
                schoolWhere = {
                    status: true,
                    afternoon: true,
                    driver: {
                        user: {
                            id: user_id,
                        },
                    },
                };
            }
            else {
                schoolWhere = {
                    status: true,
                    night: true,
                    driver: {
                        user: {
                            id: user_id,
                        },
                    },
                };
            }
            const school = await this.prismaService.school.findFirst({
                where: schoolWhere,
                select: {
                    id: true,
                    name: true,
                    morning_arrival: shift === 'morning' ? true : false,
                    morning_departure: shift === 'morning' ? true : false,
                    afternoon_arrival: shift === 'afternoon' ? true : false,
                    afternoon_departure: shift === 'afternoon' ? true : false,
                    night_arrival: shift === 'night' ? true : false,
                    night_departure: shift === 'night' ? true : false,
                    address: {
                        select: {
                            id: true,
                            place_id: true,
                            name: true,
                            latitude: true,
                            longitude: true,
                        },
                    },
                    default_location: {
                        select: {
                            id: true,
                            place_id: true,
                            name: true,
                            latitude: true,
                            longitude: true,
                        },
                    },
                },
            });
            if (school === null) {
                throw new Error('Não possui Escola.');
            }
            let studentWhere;
            if (shift === 'morning') {
                studentWhere = {
                    morning: true,
                    school: {
                        id: school.id,
                        status: true,
                        morning: true,
                    },
                    driver: {
                        user: {
                            id: user_id,
                        },
                    },
                };
            }
            else if (shift === 'afternoon') {
                studentWhere = {
                    afternoon: true,
                    school: {
                        id: school.id,
                        status: true,
                        afternoon: true,
                    },
                    driver: {
                        user: {
                            id: user_id,
                        },
                    },
                };
            }
            else {
                studentWhere = {
                    night: true,
                    school: {
                        id: school.id,
                        status: true,
                        night: true,
                    },
                    driver: {
                        user: {
                            id: user_id,
                        },
                    },
                };
            }
            const students = await this.prismaService.student.findMany({
                where: studentWhere,
                select: {
                    id: true,
                    name: true,
                    goes: true,
                    return: true,
                    morning: shift === 'morning' ? true : false,
                    afternoon: shift === 'afternoon' ? true : false,
                    night: shift === 'night' ? true : false,
                    school_id: true,
                    address: {
                        select: {
                            id: true,
                            place_id: true,
                            name: true,
                            latitude: true,
                            longitude: true,
                        },
                    },
                },
                orderBy: [{ school: { name: 'asc' } }, { name: 'asc' }],
            });
            if (students.length === 0) {
                throw new Error('Não possui Estudantes.');
            }
            const studentsAbsent = [];
            const waypointsInitial = [];
            const waypointsAll = [];
            const studentsPresent = [];
            const ordainedStudents = [];
            const ordainedStudentsAll = [];
            if (type === 'going') {
                for (let i = 0; i < students.length; i++) {
                    if (students[i].goes === true) {
                        const waypoint = {
                            lat: students[i].address.latitude,
                            lng: students[i].address.longitude,
                        };
                        studentsPresent.push(students[i]);
                        waypointsInitial.push(waypoint);
                    }
                    else {
                        studentsAbsent.push(students[i]);
                    }
                }
                const { available_travel_modes, geocoded_waypoints, routes, request, status, } = await this.directionsService.getDirections(school.default_location.place_id, school.address.place_id, waypointsInitial);
                if (status !== 'OK') {
                    throw new Error('Erro na Consulta');
                }
                const times = await this.tripsTimeService.checkTime(shift, type, routes, school, studentsPresent.length);
                for (let i = 0; i < studentsPresent.length; i++) {
                    ordainedStudents.push(studentsPresent[routes[0].waypoint_order[i]]);
                }
                for (let i = 0; i < students.length; i++) {
                    const waypoint = {
                        lat: students[i].address.latitude,
                        lng: students[i].address.longitude,
                    };
                    waypointsAll.push(waypoint);
                }
                const { routes: routesAll, status: statusAll } = await this.directionsService.getDirections(school.default_location.place_id, school.address.place_id, waypointsAll);
                if (statusAll !== 'OK') {
                    throw new Error('Erro na Consulta');
                }
                const timesAll = await this.tripsTimeService.checkTime(shift, type, routesAll, school, students.length);
                for (let i = 0; i < students.length; i++) {
                    ordainedStudentsAll.push(students[routesAll[0].waypoint_order[i]]);
                }
                for (let i = 0; i < ordainedStudents.length; i++) {
                    ordainedStudents[i].type = 'going';
                }
                for (let i = 0; i < studentsAbsent.length; i++) {
                    studentsAbsent[i].type = 'going';
                }
                return {
                    error: false,
                    studentsAbsent,
                    ordainedStudents,
                    ordainedStudentsAll,
                    times,
                    timesAll,
                    directions: {
                        available_travel_modes,
                        geocoded_waypoints,
                        routes,
                        request,
                        status,
                    },
                    school,
                    students_length: students.length,
                };
            }
            else if (type === 'return') {
                for (let i = 0; i < students.length; i++) {
                    if (students[i].return === true) {
                        const waypoint = {
                            lat: students[i].address.latitude,
                            lng: students[i].address.longitude,
                        };
                        waypointsInitial.push(waypoint);
                        studentsPresent.push(students[i]);
                    }
                    else {
                        studentsAbsent.push(students[i]);
                    }
                }
                const { available_travel_modes, geocoded_waypoints, routes, request, status, } = await this.directionsService.getDirections(school.address.place_id, school.default_location.place_id, waypointsInitial);
                if (status !== 'OK') {
                    throw new Error('Erro na Consulta');
                }
                const times = await this.tripsTimeService.checkTime(shift, type, routes, school, studentsPresent.length);
                for (let i = 0; i < studentsPresent.length; i++) {
                    ordainedStudents.push(studentsPresent[routes[0].waypoint_order[i]]);
                }
                for (let i = 0; i < students.length; i++) {
                    const waypoint = {
                        lat: students[i].address.latitude,
                        lng: students[i].address.longitude,
                    };
                    waypointsAll.push(waypoint);
                }
                const { routes: routesAll, status: statusAll } = await this.directionsService.getDirections(school.address.place_id, school.default_location.place_id, waypointsAll);
                if (statusAll !== 'OK') {
                    throw new Error('Erro na Consulta');
                }
                const timesAll = await this.tripsTimeService.checkTime(shift, type, routesAll, school, students.length);
                for (let i = 0; i < students.length; i++) {
                    ordainedStudentsAll.push(students[routesAll[0].waypoint_order[i]]);
                }
                for (let i = 0; i < ordainedStudents.length; i++) {
                    ordainedStudents[i].type = 'return';
                }
                for (let i = 0; i < studentsAbsent.length; i++) {
                    studentsAbsent[i].type = 'return';
                }
                return {
                    error: false,
                    studentsAbsent,
                    ordainedStudents,
                    ordainedStudentsAll,
                    times,
                    timesAll,
                    directions: {
                        available_travel_modes,
                        geocoded_waypoints,
                        routes,
                        request,
                        status,
                    },
                    school,
                    students_length: students.length,
                };
            }
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
    async generateMixTrip(return_trip, going_trip, type) {
        try {
            for (let i = 0; i < going_trip.ordainedStudents.length; i++) {
                going_trip.ordainedStudents[i].type = 'going';
            }
            for (let i = 0; i < going_trip.studentsAbsent.length; i++) {
                going_trip.studentsAbsent[i].type = 'going';
            }
            for (let i = 0; i < return_trip.ordainedStudents.length; i++) {
                return_trip.ordainedStudents[i].type = 'return';
            }
            for (let i = 0; i < return_trip.studentsAbsent.length; i++) {
                return_trip.studentsAbsent[i].type = 'return';
            }
            const studentsAbsent = return_trip.studentsAbsent.concat(going_trip.studentsAbsent);
            const studentsPresent = return_trip.ordainedStudents.concat(going_trip.ordainedStudents);
            const waypointsInitial = [];
            const ordainedStudents = [];
            for (let i = 0; i < studentsPresent.length; i++) {
                const waypoint = {
                    lat: studentsPresent[i].address.latitude,
                    lng: studentsPresent[i].address.longitude,
                };
                waypointsInitial.push(waypoint);
            }
            const { available_travel_modes, geocoded_waypoints, routes, request, status, } = await this.directionsService.getDirections(return_trip.directions.request.origin.place_id.replace('place_id:', ''), going_trip.directions.request.destination.place_id.replace('place_id:', ''), waypointsInitial);
            if (status !== 'OK') {
                throw new Error('Erro na Consulta');
            }
            const times = await this.tripsTimeService.checkTimeMix(type, routes, return_trip.school, studentsPresent.length);
            for (let i = 0; i < studentsPresent.length; i++) {
                ordainedStudents.push(studentsPresent[routes[0].waypoint_order[i]]);
            }
            const studentsAll = studentsPresent.concat(studentsAbsent);
            const waypointsAll = [];
            const ordainedStudentsAll = [];
            for (let i = 0; i < studentsAll.length; i++) {
                const waypoint = {
                    lat: studentsAll[i].address.latitude,
                    lng: studentsAll[i].address.longitude,
                };
                waypointsAll.push(waypoint);
            }
            const { routes: routesAll, status: statusAll } = await this.directionsService.getDirections(return_trip.directions.request.origin.place_id.replace('place_id:', ''), going_trip.directions.request.destination.place_id.replace('place_id:', ''), waypointsAll);
            if (statusAll !== 'OK') {
                throw new Error('Erro na Consulta');
            }
            const timesAll = await this.tripsTimeService.checkTimeMix(type, routesAll, return_trip.school, studentsAll.length);
            for (let i = 0; i < studentsAll.length; i++) {
                ordainedStudentsAll.push(studentsAll[routes[0].waypoint_order[i]]);
            }
            return {
                error: false,
                studentsAbsent,
                ordainedStudents,
                ordainedStudentsAll,
                times,
                timesAll,
                directions: {
                    available_travel_modes,
                    geocoded_waypoints,
                    routes,
                    request,
                    status,
                },
            };
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
};
exports.TripGenerateService = TripGenerateService;
exports.TripGenerateService = TripGenerateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        directions_service_1.DirectionsService,
        tripsTime_service_1.TripTimeService])
], TripGenerateService);
//# sourceMappingURL=tripsGenerate.service.js.map