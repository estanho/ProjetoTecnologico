"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripTimeService = void 0;
const common_1 = require("@nestjs/common");
const moment_1 = __importDefault(require("moment"));
let TripTimeService = class TripTimeService {
    async checkIntervalTime(routes, return_trip) {
        let totalDurationInSeconds = routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0);
        const totalDistanceInMeters = routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0);
        totalDurationInSeconds = totalDurationInSeconds + 300;
        const totalDurationMoment = moment_1.default.duration(totalDurationInSeconds, 'seconds');
        const totalDistanceInKilometers = totalDistanceInMeters / 1000;
        const totalMinutes = totalDurationMoment.asMinutes();
        const return_time = (0, moment_1.default)(return_trip.times.estimated);
        const return_time_add = return_time
            .clone()
            .add(totalMinutes, 'minutes')
            .toDate();
        return {
            totalTravelTime: totalMinutes,
            return_time_add,
            totalKM: totalDistanceInKilometers,
        };
    }
    async checkTime(shift, type, routes, school, students_length) {
        try {
            if (type === 'going') {
                let totalDurationInSeconds = routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0);
                const totalDistanceInMeters = routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0);
                totalDurationInSeconds =
                    totalDurationInSeconds + students_length * 120 + 300;
                const totalDurationMoment = moment_1.default.duration(totalDurationInSeconds, 'seconds');
                const totalDistanceInKilometers = totalDistanceInMeters / 1000;
                let specificTime;
                if (shift === 'morning') {
                    specificTime = school.morning_arrival;
                }
                else if (shift === 'afternoon') {
                    specificTime = school.afternoon_arrival;
                }
                else {
                    specificTime = school.night_arrival;
                }
                const result = (0, moment_1.default)(specificTime).subtract(totalDurationMoment);
                const totalMinutes = totalDurationMoment.asMinutes();
                return {
                    totalTravelTime: totalMinutes,
                    estimated: result.toDate(),
                    totalKM: totalDistanceInKilometers,
                };
            }
            else if (type === 'return') {
                let totalDurationInSeconds = routes[0].legs
                    .slice(0, -1)
                    .reduce((total, leg) => total + leg.duration.value, 0);
                const totalDistanceInMeters = routes[0].legs
                    .slice(0, -1)
                    .reduce((total, leg) => total + leg.distance.value, 0);
                totalDurationInSeconds =
                    totalDurationInSeconds + students_length * 120 + 300;
                const totalDurationMoment = moment_1.default.duration(totalDurationInSeconds, 'seconds');
                const totalDistanceInKilometers = totalDistanceInMeters / 1000;
                let specificTime;
                if (shift === 'morning') {
                    specificTime = school.morning_departure;
                }
                else if (shift === 'afternoon') {
                    specificTime = school.afternoon_departure;
                }
                else {
                    specificTime = school.night_departure;
                }
                const result = (0, moment_1.default)(specificTime).add(totalDurationMoment);
                const totalMinutes = totalDurationMoment.asMinutes();
                return {
                    totalTravelTime: totalMinutes,
                    estimated: result.toDate(),
                    totalKM: totalDistanceInKilometers,
                };
            }
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
    async checkTimeMix(type, routes, school_return, students_length) {
        try {
            let totalDurationInSeconds = routes[0].legs.reduce((total, leg) => total + leg.duration.value, 0);
            const totalDistanceInMeters = routes[0].legs.reduce((total, leg) => total + leg.distance.value, 0);
            totalDurationInSeconds =
                totalDurationInSeconds + students_length * 120 + 300;
            const totalDurationMoment = moment_1.default.duration(totalDurationInSeconds, 'seconds');
            const totalDistanceInKilometers = totalDistanceInMeters / 1000;
            let specificTime;
            if (type === 'morning_afternoon') {
                specificTime = school_return.morning_departure;
            }
            else if (type === 'afternoon_night') {
                specificTime = school_return.afternoon_departure;
            }
            const result = (0, moment_1.default)(specificTime).add(totalDurationMoment);
            const totalMinutes = totalDurationMoment.asMinutes();
            return {
                totalTravelTime: totalMinutes,
                estimated: result.toDate(),
                totalKM: totalDistanceInKilometers,
            };
        }
        catch (error) {
            return { error: true, message: error };
        }
    }
};
exports.TripTimeService = TripTimeService;
exports.TripTimeService = TripTimeService = __decorate([
    (0, common_1.Injectable)()
], TripTimeService);
//# sourceMappingURL=tripsTime.service.js.map