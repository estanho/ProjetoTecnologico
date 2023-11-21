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
exports.TripCreateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const client_1 = require("@prisma/client");
function converterStringParaShift(valor) {
    return client_1.Shift[valor];
}
function converterStringParaType(valor) {
    return client_1.TypeTrip[valor];
}
let TripCreateService = class TripCreateService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async createTrip(trip, shift, type, itinerary_id) {
        try {
            const newTrip = await this.prismaService.trip.create({
                data: {
                    path: JSON.stringify(trip.directions),
                    shift: converterStringParaShift(shift),
                    type: converterStringParaType(type),
                    km: trip.times.totalKM,
                    duration: trip.times.totalTravelTime,
                    itinerary: {
                        connect: {
                            id: itinerary_id,
                        },
                    },
                    estimated: trip.times.estimated,
                },
            });
            const students_trip = await this.createStudentTrip(trip, newTrip.id);
            if (students_trip.error === true) {
                throw new Error('Erro ao gerar Trips para estudantes.');
            }
            return { error: false, trip: newTrip };
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
    async createStudentTrip(trip, trip_id) {
        try {
            for (let i = 0; i < trip.ordainedStudents.length; i++) {
                await this.prismaService.student_Trip.create({
                    data: {
                        order: i + 1,
                        absent: false,
                        type: trip.ordainedStudents[i].type === 'going' ? 'going' : 'return',
                        trip: {
                            connect: {
                                id: trip_id,
                            },
                        },
                        student: {
                            connect: {
                                id: trip.ordainedStudents[i].id,
                            },
                        },
                    },
                });
            }
            for (let i = 0; i < trip.studentsAbsent.length; i++) {
                await this.prismaService.student_Trip.create({
                    data: {
                        order: null,
                        absent: true,
                        type: trip.studentsAbsent[i].type === 'going' ? 'going' : 'return',
                        trip: {
                            connect: {
                                id: trip_id,
                            },
                        },
                        student: {
                            connect: {
                                id: trip.studentsAbsent[i].id,
                            },
                        },
                    },
                });
            }
            return { error: false };
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
};
exports.TripCreateService = TripCreateService;
exports.TripCreateService = TripCreateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TripCreateService);
//# sourceMappingURL=tripsCreate.service.js.map