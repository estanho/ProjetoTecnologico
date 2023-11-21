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
exports.ItinerariesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ItinerariesService = class ItinerariesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async create(user) {
        try {
            const driver = await this.prismaService.driver.findFirst({
                where: {
                    user_id: user.id,
                },
            });
            if (driver === null) {
                throw new Error('Não foi encontrado motorista.');
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (today.getDay() === 6 || today.getDay() === 0) {
                while (today.getDay() !== 1) {
                    today.setDate(today.getDate() + 1);
                }
            }
            else {
            }
            await this.prismaService.itinerary.create({
                data: {
                    day: today,
                    driver: {
                        connect: {
                            id: driver.id,
                        },
                    },
                },
            });
            return { error: false };
        }
        catch (error) {
            return { error: true };
        }
    }
    async update(user) {
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
            const school_morning = await this.prismaService.school.findFirst({
                where: {
                    driver: {
                        user_id: user.id,
                    },
                    morning: true,
                    status: true,
                },
                select: {
                    id: true,
                },
            });
            const school_afternoon = await this.prismaService.school.findFirst({
                where: {
                    driver: {
                        user_id: user.id,
                    },
                    afternoon: true,
                    status: true,
                },
                select: {
                    id: true,
                },
            });
            const school_night = await this.prismaService.school.findFirst({
                where: {
                    driver: {
                        user_id: user.id,
                    },
                    night: true,
                    status: true,
                },
                select: {
                    id: true,
                },
            });
            if (school_morning !== null) {
                await this.prismaService.itinerary.update({
                    where: {
                        id: itinerary.id,
                    },
                    data: {
                        school_morning: {
                            connect: {
                                id: school_morning.id,
                            },
                        },
                    },
                });
            }
            else {
                await this.prismaService.itinerary.update({
                    where: {
                        id: itinerary.id,
                    },
                    data: {
                        school_morning_id: null,
                    },
                });
            }
            if (school_afternoon !== null) {
                await this.prismaService.itinerary.update({
                    where: {
                        id: itinerary.id,
                    },
                    data: {
                        school_afternoon: {
                            connect: {
                                id: school_afternoon.id,
                            },
                        },
                    },
                });
            }
            else {
                await this.prismaService.itinerary.update({
                    where: {
                        id: itinerary.id,
                    },
                    data: {
                        school_afternoon_id: null,
                    },
                });
            }
            if (school_night !== null) {
                await this.prismaService.itinerary.update({
                    where: {
                        id: itinerary.id,
                    },
                    data: {
                        school_night: {
                            connect: {
                                id: school_night.id,
                            },
                        },
                    },
                });
            }
            else {
                await this.prismaService.itinerary.update({
                    where: {
                        id: itinerary.id,
                    },
                    data: {
                        school_night_id: null,
                    },
                });
            }
            return { error: false };
        }
        catch (error) {
            return { error: true };
        }
    }
};
exports.ItinerariesService = ItinerariesService;
exports.ItinerariesService = ItinerariesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItinerariesService);
//# sourceMappingURL=itineraries.service.js.map