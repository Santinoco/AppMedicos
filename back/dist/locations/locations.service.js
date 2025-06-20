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
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const location_model_1 = require("./entities/location.model");
let LocationService = class LocationService {
    locationRepository;
    constructor(locationRepository) {
        this.locationRepository = locationRepository;
    }
    async getAllLocations() {
        return this.locationRepository.find({ order: { location_id: "ASC" } });
    }
    async getLocationById(location_id) {
        return this.locationRepository.findOne({ where: { location_id } });
    }
    async createLocation(locationData) {
        const location = this.locationRepository.create(locationData);
        return this.locationRepository.save(location);
    }
    async deleteLocation(location_id) {
        const result = await this.locationRepository.delete({ location_id });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Location with id ${location_id} not found`);
        }
        return { message: "Location deleted successfully" };
    }
    async updateLocation(location_id, updateData) {
        const location = await this.locationRepository.findOne({ where: { location_id } });
        if (!location)
            throw new common_1.NotFoundException('Location not found');
        Object.assign(location, updateData);
        return this.locationRepository.save(location);
    }
};
exports.LocationService = LocationService;
exports.LocationService = LocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_model_1.Location)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LocationService);
//# sourceMappingURL=locations.service.js.map