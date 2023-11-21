"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsModule = void 0;
const common_1 = require("@nestjs/common");
const trips_service_1 = require("./trips.service");
const trips_controller_1 = require("./trips.controller");
const tripsTime_service_1 = require("./services/tripsTime.service");
const maps_module_1 = require("../maps/maps.module");
const tripsGenerate_service_1 = require("./services/tripsGenerate.service");
const tripsCreate_service_1 = require("./services/tripsCreate.service");
const tripsLogic_service_1 = require("./tripsLogic.service");
let TripsModule = class TripsModule {
};
exports.TripsModule = TripsModule;
exports.TripsModule = TripsModule = __decorate([
    (0, common_1.Module)({
        imports: [maps_module_1.MapsModule],
        controllers: [trips_controller_1.TripsController],
        providers: [
            trips_service_1.TripsService,
            tripsLogic_service_1.TripsLogicService,
            tripsCreate_service_1.TripCreateService,
            tripsGenerate_service_1.TripGenerateService,
            tripsTime_service_1.TripTimeService,
        ],
        exports: [tripsLogic_service_1.TripsLogicService],
    })
], TripsModule);
//# sourceMappingURL=trips.module.js.map