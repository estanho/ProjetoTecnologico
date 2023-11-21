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
exports.DirectionsService = void 0;
const common_1 = require("@nestjs/common");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
let DirectionsService = class DirectionsService {
    constructor(googleMapsClient) {
        this.googleMapsClient = googleMapsClient;
    }
    async getIntervalDirections(originId, destinationId) {
        const params = {
            origin: `place_id:${originId}`,
            destination: `place_id:${destinationId}`,
            mode: google_maps_services_js_1.TravelMode.driving,
            key: process.env.GOOGLE_MAPS_API_KEY,
        };
        try {
            const { data } = await this.googleMapsClient.directions({
                params,
            });
            return {
                ...data,
            };
        }
        catch (error) {
            console.error('Erro ao obter direções:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
    async getDirections(originId, destinationId, waypoints) {
        const params = {
            origin: `place_id:${originId}`,
            destination: `place_id:${destinationId}`,
            waypoints: waypoints,
            optimize: true,
            mode: google_maps_services_js_1.TravelMode.driving,
            key: process.env.GOOGLE_MAPS_API_KEY,
        };
        try {
            const { data } = await this.googleMapsClient.directions({
                params,
            });
            return {
                ...data,
                request: {
                    origin: {
                        place_id: params.origin,
                        lat: data.routes[0].legs[0].start_location.lat,
                        lng: data.routes[0].legs[0].start_location.lng,
                    },
                    destination: {
                        place_id: params.destination,
                        lat: data.routes[0].legs[data.routes[0].legs.length - 1]
                            .end_location.lat,
                        lng: data.routes[0].legs[data.routes[0].legs.length - 1]
                            .end_location.lng,
                    },
                    mode: params.mode,
                },
            };
        }
        catch (error) {
            console.error('Erro ao obter direções:', error.response ? error.response.data : error.message);
            throw error;
        }
    }
};
exports.DirectionsService = DirectionsService;
exports.DirectionsService = DirectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [google_maps_services_js_1.Client])
], DirectionsService);
//# sourceMappingURL=directions.service.js.map