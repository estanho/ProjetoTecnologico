"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapsModule = void 0;
const common_1 = require("@nestjs/common");
const google_maps_services_js_1 = require("@googlemaps/google-maps-services-js");
const places_service_1 = require("./places/places.service");
const places_controller_1 = require("./places/places.controller");
const directions_service_1 = require("./directions/directions.service");
const directions_controller_1 = require("./directions/directions.controller");
let MapsModule = class MapsModule {
};
exports.MapsModule = MapsModule;
exports.MapsModule = MapsModule = __decorate([
    (0, common_1.Module)({
        providers: [
            {
                provide: google_maps_services_js_1.Client,
                useValue: new google_maps_services_js_1.Client({}),
            },
            places_service_1.PlacesService,
            directions_service_1.DirectionsService,
        ],
        controllers: [places_controller_1.PlacesController, directions_controller_1.DirectionsController],
        exports: [directions_service_1.DirectionsService],
    })
], MapsModule);
//# sourceMappingURL=maps.module.js.map