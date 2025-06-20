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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const locations_service_1 = require("./locations.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/roles/roles.guard");
const roles_decorator_1 = require("../auth/roles/roles.decorator");
let LocationController = class LocationController {
    locationService;
    constructor(locationService) {
        this.locationService = locationService;
    }
    async getAllLocations() {
        return this.locationService.getAllLocations();
    }
    async getLocationById(location_id) {
        return this.locationService.getLocationById(location_id);
    }
    async createLocation(locationData) {
        return this.locationService.createLocation(locationData);
    }
    async deleteLocation(location_id) {
        return this.locationService.deleteLocation(location_id);
    }
    async updateLocation(location_id, updateData) {
        return this.locationService.updateLocation(location_id, updateData);
    }
};
exports.LocationController = LocationController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getAllLocations", null);
__decorate([
    (0, common_1.Get)(":location_id"),
    __param(0, (0, common_1.Param)("location_id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getLocationById", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Delete)(':location_id'),
    (0, roles_decorator_1.Roles)("administrator"),
    __param(0, (0, common_1.Param)('location_id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "deleteLocation", null);
__decorate([
    (0, common_1.Patch)(':location_id'),
    __param(0, (0, common_1.Param)('location_id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "updateLocation", null);
exports.LocationController = LocationController = __decorate([
    (0, common_1.Controller)("locations"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [locations_service_1.LocationService])
], LocationController);
//# sourceMappingURL=locations.controller.js.map