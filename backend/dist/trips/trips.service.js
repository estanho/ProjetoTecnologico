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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const tripsGenerate_service_1 = require("./services/tripsGenerate.service");
const prisma_service_1 = require("../database/prisma.service");
const tripsCreate_service_1 = require("./services/tripsCreate.service");
const moment_1 = __importDefault(require("moment"));
let TripsService = class TripsService {
    constructor(prismaService, tripGenerateService, tripCreateService) {
        this.prismaService = prismaService;
        this.tripGenerateService = tripGenerateService;
        this.tripCreateService = tripCreateService;
    }
    async findAllDriver(user) {
        try {
            const itineraries = await this.prismaService.itinerary.findMany({
                where: {
                    driver: {
                        user_id: user.id,
                    },
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
                orderBy: {
                    day: 'desc',
                },
            });
            if (itineraries === null) {
                throw new Error('no_itinerary');
            }
            const result = [];
            for (let i = 0; i < itineraries.length; i++) {
                const itinerary = itineraries[i];
                const trips = await this.prismaService.trip.findMany({
                    where: {
                        itinerary_id: itinerary.id,
                    },
                    select: {
                        id: true,
                        path: true,
                        duration: true,
                        estimated: true,
                        started_at: true,
                        finished_at: true,
                        type: true,
                        km: true,
                        student_trips: {
                            select: {
                                student: {
                                    select: {
                                        name: true,
                                        goes: true,
                                        return: true,
                                        address: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                        responsible_absence_going: {
                                            select: {
                                                user: {
                                                    select: {
                                                        name: true,
                                                    },
                                                },
                                            },
                                        },
                                        responsible_absence_return: {
                                            select: {
                                                user: {
                                                    select: {
                                                        name: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                                order: true,
                                absent: true,
                                time: true,
                                type: true,
                            },
                            orderBy: {
                                order: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        estimated: 'asc',
                    },
                });
                const newItinerary = {
                    id: itinerary.id,
                    title: (0, moment_1.default)(itinerary.day).format('DD/MM/YYYY'),
                    trips: [],
                };
                trips.forEach((item) => {
                    const newTrip = {
                        id: item.id,
                        title: '',
                        type: item.type,
                        schools: '',
                        duration: `${item.duration.toFixed(0)} min`,
                        km: `${item.km.toFixed(1)} km`,
                        started: item.started_at !== null
                            ? (0, moment_1.default)(item.started_at).format('HH:mm')
                            : '',
                        finished: item.finished_at !== null
                            ? (0, moment_1.default)(item.finished_at).format('HH:mm')
                            : '',
                        recommendation: item.type === 'going_morning' ||
                            item.type === 'going_afternoon' ||
                            item.type === 'going_night'
                            ? (0, moment_1.default)(item.estimated).format('HH:mm')
                            : '',
                        start_time: '',
                        end_time: '',
                        absents: [],
                        events: [],
                    };
                    if (item.type === 'going_morning') {
                        newTrip.title = '🌄 MANHÃ [Ida]';
                        newTrip.schools = `${itinerary.school_morning.name}`;
                        newTrip.start_time = (0, moment_1.default)(itinerary.school_morning.morning_arrival).format('HH:mm');
                    }
                    else if (item.type === 'return_morning') {
                        newTrip.title = '🌄 MANHÃ [Volta]';
                        newTrip.schools = `${itinerary.school_morning.name}`;
                        newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
                    }
                    else if (item.type === 'going_afternoon_return_morning') {
                        newTrip.title = '🌄 MANHÃ [Volta] -> ⛅ TARDE [Ida]';
                        newTrip.schools = `${itinerary.school_morning.name} -> ${itinerary.school_afternoon.name}`;
                        newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
                        newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
                    }
                    else if (item.type === 'going_afternoon') {
                        newTrip.title = '⛅ TARDE [Ida]';
                        newTrip.schools = `${itinerary.school_afternoon.name}`;
                        newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
                    }
                    else if (item.type === 'return_afternoon') {
                        newTrip.title = '⛅ TARDE [Volta]';
                        newTrip.schools = `${itinerary.school_afternoon.name}`;
                        newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
                    }
                    else if (item.type === 'going_night_return_afternoon') {
                        newTrip.title = '⛅ TARDE [Volta] -> 🌃 NOITE [Ida]';
                        newTrip.schools = `${itinerary.school_afternoon.name} -> ${itinerary.school_night.name}`;
                        newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
                        newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
                    }
                    else if (item.type === 'going_night') {
                        newTrip.title = '🌃 NOITE [Ida]';
                        newTrip.schools = `${itinerary.school_night.name}`;
                        newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
                    }
                    else if (item.type === 'return_night') {
                        newTrip.title = '🌃 Noite [Volta]';
                        newTrip.schools = `${itinerary.school_night.name}`;
                        newTrip.end_time = (0, moment_1.default)(itinerary.school_night.night_departure).format('HH:mm');
                    }
                    for (let i = 0; i < item.student_trips.length; i++) {
                        const newEvent = {
                            order: -1,
                            title: '',
                            type: '',
                            location: '',
                            time: '',
                            status: '',
                        };
                        newEvent.type = item.student_trips[i].type;
                        if (i === 0) {
                            const start = {
                                order: 0,
                                title: '• Partida',
                                type: '',
                                location: item.type === 'going_morning'
                                    ? `${itinerary.school_morning.default_location.name}`
                                    : item.type === 'return_morning'
                                        ? `${itinerary.school_morning.address.name}`
                                        : item.type === 'going_afternoon_return_morning'
                                            ? `${itinerary.school_morning.address.name}`
                                            : item.type === 'going_afternoon'
                                                ? `${itinerary.school_afternoon.default_location.name}`
                                                : item.type === 'return_afternoon'
                                                    ? `${itinerary.school_afternoon.address.name}`
                                                    : item.type === 'going_night_return_afternoon'
                                                        ? `${itinerary.school_afternoon.address.name}`
                                                        : item.type === 'going_night'
                                                            ? `${itinerary.school_night.default_location.name}`
                                                            : item.type === 'return_night'
                                                                ? `${itinerary.school_night.address.name}`
                                                                : '',
                                time: item.started_at !== null
                                    ? (0, moment_1.default)(item.started_at).format('HH:mm')
                                    : '',
                                status: item.started_at === null ? 'upcoming' : 'done',
                            };
                            newTrip.events.push(start);
                        }
                        if (item.student_trips[i].absent === true) {
                            if (item.student_trips[i].type === 'going') {
                                newTrip.absents.push(`• ${item.student_trips[i].student.name} [Responsável: ${item.student_trips[i].student?.responsible_absence_going?.user?.name}]`);
                            }
                            else if (item.student_trips[i].type === 'return') {
                                newTrip.absents.push(`• ${item.student_trips[i].student.name} [Responsável: ${item.student_trips[i].student?.responsible_absence_return?.user?.name}]`);
                            }
                        }
                        if (item.student_trips[i].absent === false) {
                            newEvent.title = `• ${item.student_trips[i].student.name}`;
                            newEvent.location = item.student_trips[i].student.address.name;
                            newEvent.order = item.student_trips[i].order;
                            newEvent.time =
                                item.student_trips[i].time !== null
                                    ? (0, moment_1.default)(item.student_trips[i].time).format('HH:mm')
                                    : '';
                            (newEvent.status =
                                item.student_trips[i].time === null ? 'upcoming' : 'done'),
                                newTrip.events.push(newEvent);
                            newEvent.type =
                                item.student_trips[i].type === 'going'
                                    ? ' - Embarque'
                                    : ' - Desembarque';
                        }
                        if (i === item.student_trips.length - 1) {
                            const end = {
                                order: item.student_trips.length - newTrip.absents.length + 1,
                                title: '• Fim da corrida',
                                type: '',
                                location: item.type === 'going_morning'
                                    ? `${itinerary.school_morning.address.name}`
                                    : item.type === 'return_morning'
                                        ? `${itinerary.school_morning.default_location.name}`
                                        : item.type === 'going_afternoon_return_morning'
                                            ? `${itinerary.school_afternoon.address.name}`
                                            : item.type === 'going_afternoon'
                                                ? `${itinerary.school_afternoon.address.name}`
                                                : item.type === 'return_afternoon'
                                                    ? `${itinerary.school_afternoon.default_location.name}`
                                                    : item.type === 'going_night_return_afternoon'
                                                        ? `${itinerary.school_night.address.name}`
                                                        : item.type === 'going_night'
                                                            ? `${itinerary.school_night.address.name}`
                                                            : item.type === 'return_night'
                                                                ? `${itinerary.school_night.default_location.name}`
                                                                : '',
                                time: item.finished_at !== null
                                    ? (0, moment_1.default)(item.finished_at).format('HH:mm')
                                    : '',
                                status: item.finished_at === null ? 'upcoming' : 'done',
                            };
                            newTrip.events.push(end);
                        }
                    }
                    newItinerary.trips.push(newTrip);
                });
                result.push(newItinerary);
            }
            return { error: true, result };
        }
        catch (error) {
            console.log(error);
            return { error: true, message: error.message };
        }
    }
    async findAllResponsible(user) {
        try {
            const students = await this.prismaService.student.findMany({
                where: {
                    responsibles: {
                        some: {
                            user_id: user.id,
                        },
                    },
                },
                select: {
                    id: true,
                    name: true,
                    driver: {
                        select: {
                            user_id: true,
                        },
                    },
                },
            });
            if (students === null) {
                throw new Error('no_students');
            }
            const itineraries = await this.prismaService.itinerary.findMany({
                where: {
                    trips: {
                        some: {
                            student_trips: {
                                some: {
                                    student: {
                                        id: {
                                            in: students.map((student) => student.id),
                                        },
                                    },
                                },
                            },
                        },
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
            if (itineraries === null) {
                throw new Error('no_itinerary');
            }
            const result = [];
            for (let s = 0; s < students.length; s++) {
                const newStudents = {
                    id: students[s].id,
                    name: students[s].name,
                    driver_id: students[s].driver.user_id,
                    itineraries: [],
                };
                for (let i = 0; i < itineraries.length; i++) {
                    const itinerary = itineraries[i];
                    const newItinerary = {
                        id: itinerary.id,
                        title: `${(0, moment_1.default)(itinerary.day).format('DD/MM/YYYY')} `,
                        trips: [],
                    };
                    const trips = await this.prismaService.trip.findMany({
                        where: {
                            itinerary_id: itinerary.id,
                            student_trips: {
                                some: {
                                    student: {
                                        id: students[s].id,
                                    },
                                },
                            },
                        },
                        select: {
                            id: true,
                            duration: true,
                            estimated: true,
                            started_at: true,
                            finished_at: true,
                            type: true,
                            student_trips: {
                                where: {
                                    student: {
                                        id: students[s].id,
                                    },
                                },
                                select: {
                                    student: {
                                        select: {
                                            name: true,
                                            address: {
                                                select: {
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                    order: true,
                                    absent: true,
                                    time: true,
                                    type: true,
                                },
                            },
                        },
                        orderBy: {
                            estimated: 'asc',
                        },
                    });
                    trips.forEach((item) => {
                        const newTrip = {
                            id: item.id,
                            title: '',
                            type: item.type,
                            schools: '',
                            started: item.started_at !== null
                                ? (0, moment_1.default)(item.started_at).format('HH:mm')
                                : '',
                            finished: item.finished_at !== null
                                ? (0, moment_1.default)(item.finished_at).format('HH:mm')
                                : '',
                            start_time: '',
                            end_time: '',
                            events: [],
                        };
                        for (let i = 0; i < item.student_trips.length; i++) {
                            const newEvent = {
                                order: -1,
                                title: '',
                                type: '',
                                location: '',
                                time: '',
                                status: '',
                            };
                            newEvent.type = item.student_trips[i].type;
                            if (i === 0) {
                                if (item.type === 'going_morning') {
                                    newTrip.title = '🌄 MANHÃ [Ida]';
                                    newTrip.schools = `${itinerary.school_morning.name}`;
                                    newTrip.start_time = (0, moment_1.default)(itinerary.school_morning.morning_arrival).format('HH:mm');
                                }
                                else if (item.type === 'return_morning') {
                                    newTrip.title = '🌄 MANHÃ [Volta]';
                                    newTrip.schools = `${itinerary.school_morning.name}`;
                                    newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
                                }
                                else if (item.type === 'going_afternoon_return_morning') {
                                    if (item.student_trips[i].type === 'going') {
                                        newTrip.title = '⛅ TARDE [Ida]';
                                        newTrip.schools = itinerary.school_afternoon.name;
                                        newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
                                    }
                                    else if (item.student_trips[i].type === 'return') {
                                        newTrip.title = '🌄 MANHÃ [Volta]';
                                        newTrip.schools = itinerary.school_morning.name;
                                        newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
                                    }
                                }
                                else if (item.type === 'going_afternoon') {
                                    newTrip.title = '⛅ TARDE [Ida]';
                                    newTrip.schools = `${itinerary.school_afternoon.name}`;
                                    newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
                                }
                                else if (item.type === 'return_afternoon') {
                                    newTrip.title = '⛅ TARDE [Volta]';
                                    newTrip.schools = `${itinerary.school_afternoon.name}`;
                                    newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
                                }
                                else if (item.type === 'going_night_return_afternoon') {
                                    if (item.student_trips[i].type === 'going') {
                                        newTrip.title = '🌃 Noite [Ida]';
                                        newTrip.schools = itinerary.school_night.name;
                                        newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
                                    }
                                    else if (item.student_trips[i].type === 'return') {
                                        newTrip.title = '⛅ TARDE [Volta]';
                                        newTrip.schools = itinerary.school_afternoon.name;
                                        newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
                                    }
                                }
                                else if (item.type === 'going_night') {
                                    newTrip.title = '🌃 NOITE [Ida]';
                                    newTrip.schools = `${itinerary.school_night.name}`;
                                    newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
                                }
                                else if (item.type === 'return_night') {
                                    newTrip.title = '🌃 Noite [Volta]';
                                    newTrip.schools = `${itinerary.school_night.name}`;
                                    newTrip.end_time = (0, moment_1.default)(itinerary.school_night.night_departure).format('HH:mm');
                                }
                                if (item.student_trips[i].type === 'return') {
                                    if (item.student_trips[i].absent === false) {
                                        const start = {
                                            order: 0,
                                            title: '• Corrida Iniciada',
                                            type: '',
                                            location: item.type === 'going_morning'
                                                ? '- Aguarde o motorista chegar 🚐'
                                                : item.type === 'return_morning'
                                                    ? `${itinerary.school_morning.address.name}`
                                                    : item.type === 'going_afternoon_return_morning'
                                                        ? `${itinerary.school_morning.address.name}`
                                                        : item.type === 'going_afternoon'
                                                            ? '- Aguarde o motorista chegar 🚐'
                                                            : item.type === 'return_afternoon'
                                                                ? `${itinerary.school_afternoon.address.name}`
                                                                : item.type === 'going_night_return_afternoon'
                                                                    ? `${itinerary.school_afternoon.address.name}`
                                                                    : item.type === 'going_night'
                                                                        ? '- Aguarde o motorista chegar 🚐'
                                                                        : item.type === 'return_night'
                                                                            ? `${itinerary.school_night.address.name}`
                                                                            : '',
                                            time: item.started_at !== null
                                                ? (0, moment_1.default)(item.started_at).format('HH:mm')
                                                : '',
                                            status: item.started_at === null ? 'upcoming' : 'done',
                                        };
                                        newTrip.events.push(start);
                                    }
                                    else if (item.student_trips[i].absent === true) {
                                        const start = {
                                            order: 0,
                                            title: '• Corrida Iniciada',
                                            type: '',
                                            location: item.type === 'going_morning'
                                                ? '- Aguarde o motorista chegar 🚐'
                                                : item.type === 'return_morning'
                                                    ? `${itinerary.school_morning.address.name}`
                                                    : item.type === 'going_afternoon_return_morning'
                                                        ? `${itinerary.school_morning.address.name}`
                                                        : item.type === 'going_afternoon'
                                                            ? '- Aguarde o motorista chegar 🚐'
                                                            : item.type === 'return_afternoon'
                                                                ? `${itinerary.school_afternoon.address.name}`
                                                                : item.type === 'going_night_return_afternoon'
                                                                    ? `${itinerary.school_afternoon.address.name}`
                                                                    : item.type === 'going_night'
                                                                        ? '- Aguarde o motorista chegar 🚐'
                                                                        : item.type === 'return_night'
                                                                            ? `${itinerary.school_night.address.name}`
                                                                            : '',
                                            status: 'absent',
                                        };
                                        newTrip.events.push(start);
                                    }
                                }
                            }
                            if (item.student_trips[i].absent === true) {
                                newEvent.title = `• ${item.student_trips[i].student.name}`;
                                newEvent.location = item.student_trips[i].student.address.name;
                                newEvent.status = 'absent';
                                newEvent.type =
                                    item.student_trips[i].type === 'going'
                                        ? ' - Embarque'
                                        : ' - Desembarque';
                                newTrip.events.push(newEvent);
                            }
                            if (item.student_trips[i].absent === false) {
                                newEvent.title = `• ${item.student_trips[i].student.name}`;
                                newEvent.location = item.student_trips[i].student.address.name;
                                newEvent.order = item.student_trips[i].order;
                                newEvent.time =
                                    item.student_trips[i].time !== null
                                        ? (0, moment_1.default)(item.student_trips[i].time).format('HH:mm')
                                        : '';
                                (newEvent.status =
                                    item.student_trips[i].time === null ? 'upcoming' : 'done'),
                                    (newEvent.type =
                                        item.student_trips[i].type === 'going'
                                            ? ' - Embarque'
                                            : ' - Desembarque');
                                newTrip.events.push(newEvent);
                            }
                            if (i === item.student_trips.length - 1) {
                                if (item.student_trips[i].type === 'going') {
                                    if (item.student_trips[i].absent === false) {
                                        const end = {
                                            title: '• Fim da corrida',
                                            type: '',
                                            location: item.type === 'going_morning'
                                                ? `${itinerary.school_morning.address.name}`
                                                : item.type === 'return_morning'
                                                    ? `${itinerary.school_morning.default_location.name}`
                                                    : item.type === 'going_afternoon_return_morning'
                                                        ? `${itinerary.school_afternoon.address.name}`
                                                        : item.type === 'going_afternoon'
                                                            ? `${itinerary.school_afternoon.address.name}`
                                                            : item.type === 'return_afternoon'
                                                                ? `${itinerary.school_afternoon.default_location.name}`
                                                                : item.type === 'going_night_return_afternoon'
                                                                    ? `${itinerary.school_night.address.name}`
                                                                    : item.type === 'going_night'
                                                                        ? `${itinerary.school_night.address.name}`
                                                                        : item.type === 'return_night'
                                                                            ? `${itinerary.school_night.default_location.name}`
                                                                            : '',
                                            time: item.finished_at !== null
                                                ? (0, moment_1.default)(item.finished_at).format('HH:mm')
                                                : '',
                                            status: item.finished_at === null ? 'upcoming' : 'done',
                                        };
                                        newTrip.events.push(end);
                                    }
                                    else if (item.student_trips[i].absent === true) {
                                        const end = {
                                            title: '• Fim da corrida',
                                            type: '',
                                            location: item.type === 'going_morning'
                                                ? `${itinerary.school_morning.address.name}`
                                                : item.type === 'return_morning'
                                                    ? `${itinerary.school_morning.default_location.name}`
                                                    : item.type === 'going_afternoon_return_morning'
                                                        ? `${itinerary.school_afternoon.address.name}`
                                                        : item.type === 'going_afternoon'
                                                            ? `${itinerary.school_afternoon.address.name}`
                                                            : item.type === 'return_afternoon'
                                                                ? `${itinerary.school_afternoon.default_location.name}`
                                                                : item.type === 'going_night_return_afternoon'
                                                                    ? `${itinerary.school_night.address.name}`
                                                                    : item.type === 'going_night'
                                                                        ? `${itinerary.school_night.address.name}`
                                                                        : item.type === 'return_night'
                                                                            ? `${itinerary.school_night.default_location.name}`
                                                                            : '',
                                            status: 'absent',
                                        };
                                        newTrip.events.push(end);
                                    }
                                }
                            }
                        }
                        newItinerary.trips.push(newTrip);
                    });
                    newStudents.itineraries.push(newItinerary);
                }
                result.push(newStudents);
            }
            return { error: false, result };
        }
        catch (error) {
            return { error: true, message: error.message };
        }
    }
    async findAllStudent(user) {
        try {
            const student = await this.prismaService.student.findFirst({
                where: {
                    user: {
                        id: user.id,
                    },
                },
                select: {
                    id: true,
                    name: true,
                    driver: {
                        select: {
                            user_id: true,
                        },
                    },
                },
            });
            if (student === null) {
                throw new Error('no_student');
            }
            const itineraries = await this.prismaService.itinerary.findMany({
                where: {
                    trips: {
                        some: {
                            student_trips: {
                                some: {
                                    student: {
                                        id: student.id,
                                    },
                                },
                            },
                        },
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
            if (itineraries === null) {
                throw new Error('no_itinerary');
            }
            const result = [];
            const newStudent = {
                id: student.id,
                name: student.name,
                driver_id: student.driver.user_id,
                itineraries: [],
            };
            for (let i = 0; i < itineraries.length; i++) {
                const itinerary = itineraries[i];
                const newItinerary = {
                    id: itinerary.id,
                    title: `${(0, moment_1.default)(itinerary.day).format('DD/MM/YYYY')} `,
                    trips: [],
                };
                const trips = await this.prismaService.trip.findMany({
                    where: {
                        itinerary_id: itinerary.id,
                        student_trips: {
                            some: {
                                student: {
                                    id: student.id,
                                },
                            },
                        },
                    },
                    select: {
                        id: true,
                        duration: true,
                        estimated: true,
                        started_at: true,
                        finished_at: true,
                        type: true,
                        student_trips: {
                            where: {
                                student: {
                                    id: student.id,
                                },
                            },
                            select: {
                                student: {
                                    select: {
                                        name: true,
                                        address: {
                                            select: {
                                                name: true,
                                            },
                                        },
                                    },
                                },
                                order: true,
                                absent: true,
                                time: true,
                                type: true,
                            },
                        },
                    },
                    orderBy: {
                        estimated: 'asc',
                    },
                });
                trips.forEach((item) => {
                    const newTrip = {
                        id: item.id,
                        title: '',
                        type: item.type,
                        schools: '',
                        started: item.started_at !== null
                            ? (0, moment_1.default)(item.started_at).format('HH:mm')
                            : '',
                        finished: item.finished_at !== null
                            ? (0, moment_1.default)(item.finished_at).format('HH:mm')
                            : '',
                        start_time: '',
                        end_time: '',
                        events: [],
                    };
                    for (let i = 0; i < item.student_trips.length; i++) {
                        const newEvent = {
                            order: -1,
                            title: '',
                            type: '',
                            location: '',
                            time: '',
                            status: '',
                        };
                        newEvent.type = item.student_trips[i].type;
                        if (i === 0) {
                            if (item.type === 'going_morning') {
                                newTrip.title = '🌄 MANHÃ [Ida]';
                                newTrip.schools = `${itinerary.school_morning.name}`;
                                newTrip.start_time = (0, moment_1.default)(itinerary.school_morning.morning_arrival).format('HH:mm');
                            }
                            else if (item.type === 'return_morning') {
                                newTrip.title = '🌄 MANHÃ [Volta]';
                                newTrip.schools = `${itinerary.school_morning.name}`;
                                newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
                            }
                            else if (item.type === 'going_afternoon_return_morning') {
                                if (item.student_trips[i].type === 'going') {
                                    newTrip.title = '⛅ TARDE [Ida]';
                                    newTrip.schools = itinerary.school_afternoon.name;
                                    newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
                                }
                                else if (item.student_trips[i].type === 'return') {
                                    newTrip.title = '🌄 MANHÃ [Volta]';
                                    newTrip.schools = itinerary.school_morning.name;
                                    newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
                                }
                            }
                            else if (item.type === 'going_afternoon') {
                                newTrip.title = '⛅ TARDE [Ida]';
                                newTrip.schools = `${itinerary.school_afternoon.name}`;
                                newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
                            }
                            else if (item.type === 'return_afternoon') {
                                newTrip.title = '⛅ TARDE [Volta]';
                                newTrip.schools = `${itinerary.school_afternoon.name}`;
                                newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
                            }
                            else if (item.type === 'going_night_return_afternoon') {
                                if (item.student_trips[i].type === 'going') {
                                    newTrip.title = '🌃 Noite [Ida]';
                                    newTrip.schools = itinerary.school_night.name;
                                    newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
                                }
                                else if (item.student_trips[i].type === 'return') {
                                    newTrip.title = '⛅ TARDE [Volta]';
                                    newTrip.schools = itinerary.school_afternoon.name;
                                    newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
                                }
                            }
                            else if (item.type === 'going_night') {
                                newTrip.title = '🌃 NOITE [Ida]';
                                newTrip.schools = `${itinerary.school_night.name}`;
                                newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
                            }
                            else if (item.type === 'return_night') {
                                newTrip.title = '🌃 Noite [Volta]';
                                newTrip.schools = `${itinerary.school_night.name}`;
                                newTrip.end_time = (0, moment_1.default)(itinerary.school_night.night_departure).format('HH:mm');
                            }
                            if (item.student_trips[i].type === 'return') {
                                if (item.student_trips[i].absent === false) {
                                    const start = {
                                        order: 0,
                                        title: '• Corrida Iniciada',
                                        type: '',
                                        location: item.type === 'going_morning'
                                            ? '- Aguarde o motorista chegar 🚐'
                                            : item.type === 'return_morning'
                                                ? `${itinerary.school_morning.address.name}`
                                                : item.type === 'going_afternoon_return_morning'
                                                    ? `${itinerary.school_morning.address.name}`
                                                    : item.type === 'going_afternoon'
                                                        ? '- Aguarde o motorista chegar 🚐'
                                                        : item.type === 'return_afternoon'
                                                            ? `${itinerary.school_afternoon.address.name}`
                                                            : item.type === 'going_night_return_afternoon'
                                                                ? `${itinerary.school_afternoon.address.name}`
                                                                : item.type === 'going_night'
                                                                    ? '- Aguarde o motorista chegar 🚐'
                                                                    : item.type === 'return_night'
                                                                        ? `${itinerary.school_night.address.name}`
                                                                        : '',
                                        time: item.started_at !== null
                                            ? (0, moment_1.default)(item.started_at).format('HH:mm')
                                            : '',
                                        status: item.started_at === null ? 'upcoming' : 'done',
                                    };
                                    newTrip.events.push(start);
                                }
                                else if (item.student_trips[i].absent === true) {
                                    const start = {
                                        order: 0,
                                        title: '• Corrida Iniciada',
                                        type: '',
                                        location: item.type === 'going_morning'
                                            ? '- Aguarde o motorista chegar 🚐'
                                            : item.type === 'return_morning'
                                                ? `${itinerary.school_morning.address.name}`
                                                : item.type === 'going_afternoon_return_morning'
                                                    ? `${itinerary.school_morning.address.name}`
                                                    : item.type === 'going_afternoon'
                                                        ? '- Aguarde o motorista chegar 🚐'
                                                        : item.type === 'return_afternoon'
                                                            ? `${itinerary.school_afternoon.address.name}`
                                                            : item.type === 'going_night_return_afternoon'
                                                                ? `${itinerary.school_afternoon.address.name}`
                                                                : item.type === 'going_night'
                                                                    ? '- Aguarde o motorista chegar 🚐'
                                                                    : item.type === 'return_night'
                                                                        ? `${itinerary.school_night.address.name}`
                                                                        : '',
                                        status: 'absent',
                                    };
                                    newTrip.events.push(start);
                                }
                            }
                        }
                        if (item.student_trips[i].absent === true) {
                            newEvent.title = `• ${item.student_trips[i].student.name}`;
                            newEvent.location = item.student_trips[i].student.address.name;
                            newEvent.status = 'absent';
                            newEvent.type =
                                item.student_trips[i].type === 'going'
                                    ? ' - Embarque'
                                    : ' - Desembarque';
                            newTrip.events.push(newEvent);
                        }
                        if (item.student_trips[i].absent === false) {
                            newEvent.title = `• ${item.student_trips[i].student.name}`;
                            newEvent.location = item.student_trips[i].student.address.name;
                            newEvent.order = item.student_trips[i].order;
                            newEvent.time =
                                item.student_trips[i].time !== null
                                    ? (0, moment_1.default)(item.student_trips[i].time).format('HH:mm')
                                    : '';
                            (newEvent.status =
                                item.student_trips[i].time === null ? 'upcoming' : 'done'),
                                (newEvent.type =
                                    item.student_trips[i].type === 'going'
                                        ? ' - Embarque'
                                        : ' - Desembarque');
                            newTrip.events.push(newEvent);
                        }
                        if (i === item.student_trips.length - 1) {
                            if (item.student_trips[i].type === 'going') {
                                if (item.student_trips[i].absent === false) {
                                    const end = {
                                        title: '• Fim da corrida',
                                        type: '',
                                        location: item.type === 'going_morning'
                                            ? `${itinerary.school_morning.address.name}`
                                            : item.type === 'return_morning'
                                                ? `${itinerary.school_morning.default_location.name}`
                                                : item.type === 'going_afternoon_return_morning'
                                                    ? `${itinerary.school_afternoon.address.name}`
                                                    : item.type === 'going_afternoon'
                                                        ? `${itinerary.school_afternoon.address.name}`
                                                        : item.type === 'return_afternoon'
                                                            ? `${itinerary.school_afternoon.default_location.name}`
                                                            : item.type === 'going_night_return_afternoon'
                                                                ? `${itinerary.school_night.address.name}`
                                                                : item.type === 'going_night'
                                                                    ? `${itinerary.school_night.address.name}`
                                                                    : item.type === 'return_night'
                                                                        ? `${itinerary.school_night.default_location.name}`
                                                                        : '',
                                        time: item.finished_at !== null
                                            ? (0, moment_1.default)(item.finished_at).format('HH:mm')
                                            : '',
                                        status: item.finished_at === null ? 'upcoming' : 'done',
                                    };
                                    newTrip.events.push(end);
                                }
                                else if (item.student_trips[i].absent === true) {
                                    const end = {
                                        title: '• Fim da corrida',
                                        type: '',
                                        location: item.type === 'going_morning'
                                            ? `${itinerary.school_morning.address.name}`
                                            : item.type === 'return_morning'
                                                ? `${itinerary.school_morning.default_location.name}`
                                                : item.type === 'going_afternoon_return_morning'
                                                    ? `${itinerary.school_afternoon.address.name}`
                                                    : item.type === 'going_afternoon'
                                                        ? `${itinerary.school_afternoon.address.name}`
                                                        : item.type === 'return_afternoon'
                                                            ? `${itinerary.school_afternoon.default_location.name}`
                                                            : item.type === 'going_night_return_afternoon'
                                                                ? `${itinerary.school_night.address.name}`
                                                                : item.type === 'going_night'
                                                                    ? `${itinerary.school_night.address.name}`
                                                                    : item.type === 'return_night'
                                                                        ? `${itinerary.school_night.default_location.name}`
                                                                        : '',
                                        status: 'absent',
                                    };
                                    newTrip.events.push(end);
                                }
                            }
                        }
                    }
                    newItinerary.trips.push(newTrip);
                });
                newStudent.itineraries.push(newItinerary);
            }
            result.push(newStudent);
            return { error: false, result };
        }
        catch (error) {
            return { error: true, message: error.message };
        }
    }
    async updateTripStudent(user, id, data) {
        try {
            const driver = await this.prismaService.driver.findFirst({
                where: {
                    user_id: data.driver_id,
                },
            });
            if (driver === null) {
                throw new Error('Motorista não encontrado');
            }
            const student = await this.prismaService.student.findFirst({
                where: {
                    id: data.student_id,
                    responsibles: {
                        some: {
                            user_id: user.id,
                        },
                    },
                },
            });
            if (student === null) {
                throw new Error('Estudante não encontrado');
            }
            if (data.type === 'going') {
                if (student.goes === true) {
                    await this.prismaService.student.update({
                        where: {
                            id: student.id,
                        },
                        data: {
                            responsible_absence_going: {
                                connect: {
                                    user_id: user.id,
                                },
                            },
                        },
                    });
                }
                else if (student.goes === false) {
                    await this.prismaService.student.update({
                        where: {
                            id: student.id,
                        },
                        data: {
                            responsible_absence_going: {
                                disconnect: {
                                    id: student.responsible_absence_going_id,
                                },
                            },
                        },
                    });
                }
            }
            else if (data.type === 'return') {
                if (student.return === true) {
                    await this.prismaService.student.update({
                        where: {
                            id: student.id,
                        },
                        data: {
                            responsible_absence_return: {
                                connect: {
                                    user_id: user.id,
                                },
                            },
                        },
                    });
                }
                else if (student.return === false) {
                    await this.prismaService.student.update({
                        where: {
                            id: student.id,
                        },
                        data: {
                            responsible_absence_return: {
                                disconnect: {
                                    id: student.responsible_absence_return_id,
                                },
                            },
                        },
                    });
                }
            }
            await this.prismaService.student.update({
                where: {
                    id: student.id,
                },
                data: {
                    goes: data.type === 'going' ? !student.goes : student.goes,
                    return: data.type === 'return' ? !student.return : student.return,
                },
            });
            const trip = await this.prismaService.trip.findFirst({
                where: {
                    id,
                },
            });
            if (trip === null) {
                throw new Error('Erro ao procurar Trip');
            }
            if (trip.type === 'going_morning') {
                const aux_morningGoingTrip = await this.tripGenerateService.generateTrip(driver.user_id, 'morning', 'going');
                if (aux_morningGoingTrip.error === true) {
                    throw new Error('Erro na Geração - (Manhã - Ida)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_morningGoingTrip, 'morning', 'going_morning', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Manhã - Ida)');
                }
            }
            else if (trip.type === 'return_morning') {
                const aux_morningReturnTrip = await this.tripGenerateService.generateTrip(driver.user_id, 'morning', 'return');
                if (aux_morningReturnTrip.error === true) {
                    throw new Error('Erro na Geração - (Manhã - Volta)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_morningReturnTrip, 'morning', 'return_morning', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Manhã - Volta)');
                }
            }
            else if (trip.type === 'going_afternoon_return_morning') {
                const morningReturn = await this.tripGenerateService.generateTrip(driver.user_id, 'morning', 'return');
                if (morningReturn.error === true) {
                    throw new Error('Erro na Geração Mesclada - (Manhã - Volta)');
                }
                const afternoonGoing = await this.tripGenerateService.generateTrip(driver.user_id, 'afternoon', 'going');
                if (afternoonGoing.error === true) {
                    throw new Error('Erro na Geração Mesclada - (Tarde - Ida)');
                }
                const aux_morningAfternoonTrip = await this.tripGenerateService.generateMixTrip(morningReturn, afternoonGoing, 'morning_afternoon');
                if (aux_morningAfternoonTrip.error === true) {
                    throw new Error('Erro na Geração Mesclada - (Mix)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_morningAfternoonTrip, 'morning_afternoon', 'going_afternoon_return_morning', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Manhã e Tarde)');
                }
            }
            else if (trip.type === 'going_afternoon') {
                const aux_afternoonGoingTrip = await this.tripGenerateService.generateTrip(driver.user_id, 'afternoon', 'going');
                if (aux_afternoonGoingTrip.error === true) {
                    throw new Error('Erro na Geração - (Tarde - Ida)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_afternoonGoingTrip, 'afternoon', 'going_afternoon', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Tarde - Ida)');
                }
            }
            else if (trip.type === 'return_afternoon') {
                const aux_afternoonReturnTrip = await this.tripGenerateService.generateTrip(driver.user_id, 'afternoon', 'return');
                if (aux_afternoonReturnTrip.error === true) {
                    throw new Error('Erro na Geração - (Tarde - Volta)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_afternoonReturnTrip, 'afternoon', 'return_afternoon', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Tarde - Volta)');
                }
            }
            else if (trip.type === 'going_night_return_afternoon') {
                const afternoonReturn = await this.tripGenerateService.generateTrip(driver.user_id, 'afternoon', 'return');
                if (afternoonReturn.error === true) {
                    throw new Error('Erro na Geração Mesclada - (Tarde - Volta)');
                }
                const nightGoing = await this.tripGenerateService.generateTrip(driver.user_id, 'night', 'going');
                if (nightGoing.error === true) {
                    throw new Error('Erro na Geração Mesclada - (Noite - Ida)');
                }
                const aux_afternoonNightTrip = await this.tripGenerateService.generateMixTrip(afternoonReturn, nightGoing, 'afternoon_night');
                if (aux_afternoonNightTrip.error === true) {
                    throw new Error('Erro na Geração Mesclada - (Mix)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_afternoonNightTrip, 'afternoon_night', 'going_night_return_afternoon', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Tarde e Noite)');
                }
            }
            else if (trip.type === 'going_night') {
                const aux_nightGoingTrip = await this.tripGenerateService.generateTrip(driver.user_id, 'night', 'going');
                if (aux_nightGoingTrip.error === true) {
                    throw new Error('Erro na Geração - (Noite - Ida)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_nightGoingTrip, 'night', 'going_night', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Noite - Ida)');
                }
            }
            else if (trip.type === 'return_night') {
                const aux_nightReturnTrip = await this.tripGenerateService.generateTrip(driver.user_id, 'night', 'return');
                if (aux_nightReturnTrip.error === true) {
                    throw new Error('Erro na Geração - (Noite - Volta)');
                }
                const aux_trip = await this.tripCreateService.createTrip(aux_nightReturnTrip, 'night', 'return_night', trip.itinerary_id);
                if (aux_trip.error === true) {
                    throw new Error('Erro na Criação - (Noite - Volta)');
                }
            }
            await this.prismaService.trip.delete({
                where: {
                    id: trip.id,
                },
            });
            return {
                error: false,
            };
        }
        catch (error) {
            console.log(error);
            return { error: true, message: error.message };
        }
    }
    async findTrips(user) {
        try {
            const itinerary = await this.prismaService.itinerary.findFirst({
                where: {
                    driver: {
                        user_id: user.id,
                    },
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
                orderBy: {
                    day: 'desc',
                },
            });
            if (itinerary === null) {
                throw new Error('no_itinerary');
            }
            let result = {};
            const trip = await this.prismaService.trip.findFirst({
                where: {
                    itinerary_id: itinerary.id,
                    finished_at: null,
                },
                select: {
                    id: true,
                    path: true,
                    duration: true,
                    estimated: true,
                    started_at: true,
                    finished_at: true,
                    type: true,
                    km: true,
                    student_trips: {
                        where: {
                            time: null,
                        },
                        select: {
                            student: {
                                select: {
                                    name: true,
                                    goes: true,
                                    return: true,
                                    address: {
                                        select: {
                                            name: true,
                                        },
                                    },
                                    responsible_absence_going: {
                                        select: {
                                            user: {
                                                select: {
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                    responsible_absence_return: {
                                        select: {
                                            user: {
                                                select: {
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            order: true,
                            absent: true,
                            time: true,
                            type: true,
                        },
                        orderBy: {
                            order: 'asc',
                        },
                    },
                },
                orderBy: {
                    estimated: 'asc',
                },
            });
            const newItinerary = {
                id: itinerary.id,
                title: (0, moment_1.default)(itinerary.day).format('DD/MM/YYYY'),
                trips: {},
            };
            const newTrip = {
                id: trip.id,
                title: '',
                type: trip.type,
                schools: '',
                duration: `${trip.duration.toFixed(0)} min`,
                km: `${trip.km.toFixed(1)} km`,
                started: trip.started_at !== null
                    ? (0, moment_1.default)(trip.started_at).format('HH:mm')
                    : '',
                finished: trip.finished_at !== null
                    ? (0, moment_1.default)(trip.finished_at).format('HH:mm')
                    : '',
                recommendation: trip.type === 'going_morning' ||
                    trip.type === 'going_afternoon' ||
                    trip.type === 'going_night'
                    ? (0, moment_1.default)(trip.estimated).format('HH:mm')
                    : '',
                start_time: '',
                end_time: '',
                absents: [],
                events: [],
            };
            if (trip.type === 'going_morning') {
                newTrip.title = '🌄 MANHÃ [Ida]';
                newTrip.schools = `${itinerary.school_morning.name}`;
                newTrip.start_time = (0, moment_1.default)(itinerary.school_morning.morning_arrival).format('HH:mm');
            }
            else if (trip.type === 'return_morning') {
                newTrip.title = '🌄 MANHÃ [Volta]';
                newTrip.schools = `${itinerary.school_morning.name}`;
                newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
            }
            else if (trip.type === 'going_afternoon_return_morning') {
                newTrip.title = '🌄 MANHÃ [Volta] -> ⛅ TARDE [Ida]';
                newTrip.schools = `${itinerary.school_morning.name} -> ${itinerary.school_afternoon.name}`;
                newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
                newTrip.end_time = (0, moment_1.default)(itinerary.school_morning.morning_departure).format('HH:mm');
            }
            else if (trip.type === 'going_afternoon') {
                newTrip.title = '⛅ TARDE [Ida]';
                newTrip.schools = `${itinerary.school_afternoon.name}`;
                newTrip.start_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_arrival).format('HH:mm');
            }
            else if (trip.type === 'return_afternoon') {
                newTrip.title = '⛅ TARDE [Volta]';
                newTrip.schools = `${itinerary.school_afternoon.name}`;
                newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
            }
            else if (trip.type === 'going_night_return_afternoon') {
                newTrip.title = '⛅ TARDE [Volta] -> 🌃 NOITE [Ida]';
                newTrip.schools = `${itinerary.school_afternoon.name} -> ${itinerary.school_night.name}`;
                newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
                newTrip.end_time = (0, moment_1.default)(itinerary.school_afternoon.afternoon_departure).format('HH:mm');
            }
            else if (trip.type === 'going_night') {
                newTrip.title = '🌃 NOITE [Ida]';
                newTrip.schools = `${itinerary.school_night.name}`;
                newTrip.start_time = (0, moment_1.default)(itinerary.school_night.night_arrival).format('HH:mm');
            }
            else if (trip.type === 'return_night') {
                newTrip.title = '🌃 Noite [Volta]';
                newTrip.schools = `${itinerary.school_night.name}`;
                newTrip.end_time = (0, moment_1.default)(itinerary.school_night.night_departure).format('HH:mm');
            }
            for (let i = 0; i < trip.student_trips.length; i++) {
                const newEvent = {
                    order: -1,
                    title: '',
                    type: '',
                    location: '',
                    time: '',
                    status: '',
                };
                newEvent.type = trip.student_trips[i].type;
                if (i === 0) {
                    const start = {
                        order: 0,
                        title: '• Partida',
                        type: '',
                        location: trip.type === 'going_morning'
                            ? `${itinerary.school_morning.default_location.name}`
                            : trip.type === 'return_morning'
                                ? `${itinerary.school_morning.address.name}`
                                : trip.type === 'going_afternoon_return_morning'
                                    ? `${itinerary.school_morning.address.name}`
                                    : trip.type === 'going_afternoon'
                                        ? `${itinerary.school_afternoon.default_location.name}`
                                        : trip.type === 'return_afternoon'
                                            ? `${itinerary.school_afternoon.address.name}`
                                            : trip.type === 'going_night_return_afternoon'
                                                ? `${itinerary.school_afternoon.address.name}`
                                                : trip.type === 'going_night'
                                                    ? `${itinerary.school_night.default_location.name}`
                                                    : trip.type === 'return_night'
                                                        ? `${itinerary.school_night.address.name}`
                                                        : '',
                        time: trip.started_at !== null
                            ? (0, moment_1.default)(trip.started_at).format('HH:mm')
                            : '',
                        status: trip.started_at === null ? 'upcoming' : 'done',
                    };
                    newTrip.events.push(start);
                }
                if (trip.student_trips[i].absent === true) {
                    if (trip.student_trips[i].type === 'going') {
                        newTrip.absents.push(`• ${trip.student_trips[i].student.name} [Responsável: ${trip.student_trips[i].student?.responsible_absence_going?.user?.name}]`);
                    }
                    else if (trip.student_trips[i].type === 'return') {
                        newTrip.absents.push(`• ${trip.student_trips[i].student.name} [Responsável: ${trip.student_trips[i].student?.responsible_absence_return?.user?.name}]`);
                    }
                }
                if (trip.student_trips[i].absent === false) {
                    newEvent.title = `• ${trip.student_trips[i].student.name}`;
                    newEvent.location = trip.student_trips[i].student.address.name;
                    newEvent.order = trip.student_trips[i].order;
                    newEvent.time =
                        trip.student_trips[i].time !== null
                            ? (0, moment_1.default)(trip.student_trips[i].time).format('HH:mm')
                            : '';
                    (newEvent.status =
                        trip.student_trips[i].time === null ? 'upcoming' : 'done'),
                        newTrip.events.push(newEvent);
                    newEvent.type =
                        trip.student_trips[i].type === 'going'
                            ? ' - Embarque'
                            : ' - Desembarque';
                }
                if (i === trip.student_trips.length - 1) {
                    const end = {
                        order: trip.student_trips.length - newTrip.absents.length + 1,
                        title: '• Fim da corrida',
                        type: '',
                        location: trip.type === 'going_morning'
                            ? `${itinerary.school_morning.address.name}`
                            : trip.type === 'return_morning'
                                ? `${itinerary.school_morning.default_location.name}`
                                : trip.type === 'going_afternoon_return_morning'
                                    ? `${itinerary.school_afternoon.address.name}`
                                    : trip.type === 'going_afternoon'
                                        ? `${itinerary.school_afternoon.address.name}`
                                        : trip.type === 'return_afternoon'
                                            ? `${itinerary.school_afternoon.default_location.name}`
                                            : trip.type === 'going_night_return_afternoon'
                                                ? `${itinerary.school_night.address.name}`
                                                : trip.type === 'going_night'
                                                    ? `${itinerary.school_night.address.name}`
                                                    : trip.type === 'return_night'
                                                        ? `${itinerary.school_night.default_location.name}`
                                                        : '',
                        time: trip.finished_at !== null
                            ? (0, moment_1.default)(trip.finished_at).format('HH:mm')
                            : '',
                        status: trip.finished_at === null ? 'upcoming' : 'done',
                    };
                    newTrip.events.push(end);
                }
            }
            newItinerary.trips = newTrip;
            result = newItinerary;
            return { error: false, result };
        }
        catch (error) {
            console.log(error);
            return { error: true, message: error.message };
        }
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tripsGenerate_service_1.TripGenerateService,
        tripsCreate_service_1.TripCreateService])
], TripsService);
//# sourceMappingURL=trips.service.js.map