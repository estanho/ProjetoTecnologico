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
exports.SchoolService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const dataConvert_1 = require("../utils/dataConvert");
const itineraries_service_1 = require("../itineraries/itineraries.service");
const tripsLogic_service_1 = require("../trips/tripsLogic.service");
let SchoolService = class SchoolService {
    constructor(prismaService, itinerariesService, tripsLogicService) {
        this.prismaService = prismaService;
        this.itinerariesService = itinerariesService;
        this.tripsLogicService = tripsLogicService;
    }
    async create(user, createSchoolDto) {
        try {
            createSchoolDto = (0, dataConvert_1.stringToDate)(createSchoolDto);
            const driver = await this.prismaService.driver.findFirst({
                where: {
                    user_id: user.id,
                },
                select: {
                    id: true,
                },
            });
            if (!driver) {
                throw new Error('Driver not found');
            }
            const itinerary = await this.prismaService.itinerary.findFirst({
                where: {
                    driver_id: driver.id,
                },
            });
            if (itinerary === null) {
                await this.itinerariesService.create(user);
            }
            const school = await this.prismaService.school.create({
                data: {
                    name: createSchoolDto.name,
                    driver_id: driver.id,
                    morning: createSchoolDto.morning,
                    morning_arrival: createSchoolDto.morning_arrival,
                    morning_departure: createSchoolDto.morning_departure,
                    afternoon: createSchoolDto.afternoon,
                    afternoon_arrival: createSchoolDto.afternoon_arrival,
                    afternoon_departure: createSchoolDto.afternoon_departure,
                    night: createSchoolDto.night,
                    night_arrival: createSchoolDto.night_arrival,
                    night_departure: createSchoolDto.night_departure,
                },
                select: {
                    id: true,
                },
            });
            if (!school) {
                throw new Error('School not generated');
            }
            await this.prismaService.address.create({
                data: {
                    school_address_id: school.id,
                    name: createSchoolDto.location.name,
                    place_id: createSchoolDto.location.place_id,
                    latitude: createSchoolDto.location.latitude,
                    longitude: createSchoolDto.location.longitude,
                },
            });
            await this.prismaService.address.create({
                data: {
                    school_default_id: school.id,
                    name: createSchoolDto.location.name,
                    place_id: createSchoolDto.location.place_id,
                    latitude: createSchoolDto.location.latitude,
                    longitude: createSchoolDto.location.longitude,
                },
            });
            await this.itinerariesService.update(user);
            const trips = await this.tripsLogicService.create(user);
            if (trips.error === true) {
                await this.prismaService.school.delete({
                    where: {
                        id: school.id,
                    },
                });
                return { error: true, message: trips.message };
            }
            return { error: false };
        }
        catch (error) {
            return { error: true, message: error.message };
        }
    }
    async findAll(user) {
        try {
            const itinerary = await this.prismaService.itinerary.findFirst({
                where: {
                    driver: {
                        user_id: user.id,
                    },
                },
                orderBy: {
                    day: 'desc',
                },
                select: {
                    id: true,
                    day: true,
                    started: true,
                    school_morning_id: true,
                    school_morning: {
                        select: {
                            name: true,
                            status: true,
                            morning_arrival: true,
                            morning_departure: true,
                            address: {
                                select: {
                                    name: true,
                                },
                            },
                            default_location: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    school_afternoon_id: true,
                    school_afternoon: {
                        select: {
                            name: true,
                            status: true,
                            afternoon_arrival: true,
                            afternoon_departure: true,
                            address: {
                                select: {
                                    name: true,
                                },
                            },
                            default_location: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    school_night_id: true,
                    school_night: {
                        select: {
                            name: true,
                            status: true,
                            night_arrival: true,
                            night_departure: true,
                            address: {
                                select: {
                                    name: true,
                                },
                            },
                            default_location: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
            const data = await this.prismaService.school.findMany({
                where: {
                    driver: {
                        user_id: user.id,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    address: {
                        select: {
                            id: true,
                            name: true,
                            latitude: true,
                            longitude: true,
                            place_id: true,
                        },
                    },
                    default_location: {
                        select: {
                            id: true,
                            name: true,
                            latitude: true,
                            longitude: true,
                            place_id: true,
                        },
                    },
                    status: true,
                    morning: true,
                    morning_arrival: true,
                    morning_departure: true,
                    afternoon: true,
                    afternoon_arrival: true,
                    afternoon_departure: true,
                    night: true,
                    night_arrival: true,
                    night_departure: true,
                },
                orderBy: [{ name: 'asc' }],
            });
            const schools = [];
            data.forEach((item) => {
                const newItem = {
                    id: item.id,
                    name: item.name,
                    address: item.address.name,
                    location: {
                        id: item.address.id,
                        name: item.address.name,
                        latitude: item.address.latitude,
                        longitude: item.address.longitude,
                        place_id: item.address.place_id,
                    },
                    default_address: item.default_location.name,
                    default_location: {
                        id: item.default_location.id,
                        name: item.default_location.name,
                        latitude: item.default_location.latitude,
                        longitude: item.default_location.longitude,
                        place_id: item.default_location.place_id,
                    },
                    status: item.status,
                    morning: item.morning,
                    morning_arrival: item.morning_arrival,
                    morning_departure: item.morning_departure,
                    afternoon: item.afternoon,
                    afternoon_arrival: item.afternoon_arrival,
                    afternoon_departure: item.afternoon_departure,
                    night: item.night,
                    night_arrival: item.night_arrival,
                    night_departure: item.night_departure,
                };
                schools.push(newItem);
            });
            return {
                error: false,
                schools,
                started: itinerary?.started === undefined ? false : itinerary.started,
            };
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
    async update(user, id, updateSchoolDto) {
        try {
            updateSchoolDto = (0, dataConvert_1.stringToDate)(updateSchoolDto);
            const driver = await this.prismaService.driver.findFirst({
                where: {
                    user_id: user.id,
                },
                select: {
                    id: true,
                },
            });
            if (!driver) {
                throw new Error('Driver not found');
            }
            const oldSchool = await this.prismaService.school.findFirst({
                where: {
                    id: id,
                    driver_id: driver.id,
                },
                select: {
                    name: true,
                    morning: true,
                    morning_arrival: true,
                    morning_departure: true,
                    afternoon: true,
                    afternoon_arrival: true,
                    afternoon_departure: true,
                    night: true,
                    night_arrival: true,
                    night_departure: true,
                    address: {
                        select: {
                            school_address_id: true,
                            name: true,
                            place_id: true,
                            latitude: true,
                            longitude: true,
                        },
                    },
                    default_location: {
                        select: {
                            school_address_id: true,
                            name: true,
                            place_id: true,
                            latitude: true,
                            longitude: true,
                        },
                    },
                },
            });
            const school = await this.prismaService.school.update({
                where: {
                    id: id,
                    driver_id: driver.id,
                },
                data: {
                    name: updateSchoolDto.name,
                    morning: updateSchoolDto.morning,
                    morning_arrival: updateSchoolDto.morning_arrival,
                    morning_departure: updateSchoolDto.morning_departure,
                    afternoon: updateSchoolDto.afternoon,
                    afternoon_arrival: updateSchoolDto.afternoon_arrival,
                    afternoon_departure: updateSchoolDto.afternoon_departure,
                    night: updateSchoolDto.night,
                    night_arrival: updateSchoolDto.night_arrival,
                    night_departure: updateSchoolDto.night_departure,
                    address: {
                        update: {
                            name: updateSchoolDto.location.name,
                            place_id: updateSchoolDto.location.place_id,
                            latitude: updateSchoolDto.location.latitude,
                            longitude: updateSchoolDto.location.longitude,
                        },
                    },
                    default_location: {
                        update: {
                            name: updateSchoolDto.default_location.name,
                            place_id: updateSchoolDto.default_location.place_id,
                            latitude: updateSchoolDto.default_location.latitude,
                            longitude: updateSchoolDto.default_location.longitude,
                        },
                    },
                },
            });
            if (!school) {
                throw new Error('School not generated');
            }
            await this.itinerariesService.update(user);
            const trips = await this.tripsLogicService.create(user);
            if (trips.error === true) {
                await this.prismaService.school.update({
                    where: {
                        id: id,
                        driver_id: driver.id,
                    },
                    data: {
                        name: oldSchool.name,
                        morning: oldSchool.morning,
                        morning_arrival: oldSchool.morning_arrival,
                        morning_departure: oldSchool.morning_departure,
                        afternoon: oldSchool.afternoon,
                        afternoon_arrival: oldSchool.afternoon_arrival,
                        afternoon_departure: oldSchool.afternoon_departure,
                        night: oldSchool.night,
                        night_arrival: oldSchool.night_arrival,
                        night_departure: oldSchool.night_departure,
                        address: {
                            update: {
                                name: oldSchool.address.name,
                                place_id: oldSchool.address.place_id,
                                latitude: oldSchool.address.latitude,
                                longitude: oldSchool.address.longitude,
                            },
                        },
                        default_location: {
                            update: {
                                name: oldSchool.default_location.name,
                                place_id: oldSchool.default_location.place_id,
                                latitude: oldSchool.default_location.latitude,
                                longitude: oldSchool.default_location.longitude,
                            },
                        },
                    },
                });
                return { error: true, message: trips.message };
            }
            return { error: false };
        }
        catch (error) {
            return { error: true, message: error.message };
        }
    }
    async updateStatus(user, id, data) {
        try {
            const driver = await this.prismaService.driver.findFirst({
                where: {
                    user_id: user.id,
                },
                select: {
                    id: true,
                },
            });
            if (!driver) {
                throw new Error('Driver not found');
            }
            await this.prismaService.school.update({
                where: {
                    id: id,
                    driver_id: driver.id,
                },
                data: {
                    status: data.status === true ? false : true,
                },
                select: {
                    id: true,
                    status: true,
                },
            });
            await this.itinerariesService.update(user);
            const trips = await this.tripsLogicService.create(user);
            if (trips.error === true) {
                await this.prismaService.school.update({
                    where: {
                        id: id,
                        driver_id: driver.id,
                    },
                    data: {
                        status: false,
                    },
                });
                return { error: true, message: trips.message };
            }
            return { error: false };
        }
        catch (error) {
            return { error: true, message: error.message };
        }
    }
    async remove(user, id) {
        try {
            await this.prismaService.school.delete({
                where: {
                    id,
                    driver: {
                        user: {
                            id: user.id,
                        },
                    },
                },
            });
            await this.itinerariesService.update(user);
            const trips = await this.tripsLogicService.create(user);
            if (trips.error === true) {
                return { error: true, message: trips.message };
            }
            return { error: false };
        }
        catch (error) {
            return { error: true, message: error.message };
        }
    }
};
exports.SchoolService = SchoolService;
exports.SchoolService = SchoolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        itineraries_service_1.ItinerariesService,
        tripsLogic_service_1.TripsLogicService])
], SchoolService);
//# sourceMappingURL=school.service.js.map