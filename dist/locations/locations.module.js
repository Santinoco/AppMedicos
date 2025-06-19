"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationModule = void 0;
const common_1 = require("@nestjs/common");
const locations_controller_1 = require("./locations.controller");
const locations_service_1 = require("./locations.service");
const typeorm_1 = require("@nestjs/typeorm");
const location_model_1 = require("./entities/location.model");
let LocationModule = class LocationModule {
};
exports.LocationModule = LocationModule;
exports.LocationModule = LocationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([location_model_1.Location])],
        controllers: [locations_controller_1.LocationController],
        providers: [locations_service_1.LocationService],
        exports: [locations_service_1.LocationService],
    })
], LocationModule);
//# sourceMappingURL=locations.module.js.map