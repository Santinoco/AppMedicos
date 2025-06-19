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
exports.CalendarService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const calendar_model_1 = require("./entities/calendar.model");
const typeorm_2 = require("typeorm");
const date_fns_1 = require("date-fns");
let CalendarService = class CalendarService {
    slotRepository;
    constructor(slotRepository) {
        this.slotRepository = slotRepository;
    }
    async generateSlots() {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 3);
        const startHour = 10;
        const endHour = 19;
        const intervalMinutes = 30;
        const slots = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            if ((0, date_fns_1.isWeekend)(d))
                continue;
            for (let hour = startHour; hour < endHour; hour++) {
                for (let minute = 0; minute < 60; minute += intervalMinutes) {
                    const slot = new Date(d);
                    slot.setHours(hour, minute, 0, 0);
                    if (slot >= startDate && slot <= endDate) {
                        slots.push(new Date(slot));
                    }
                }
            }
        }
        const slotEntities = slots.map((slotDate) => {
            const slot = new calendar_model_1.Calendar();
            slot.slot_datetime = slotDate;
            return slot;
        });
        await this.slotRepository.upsert(slotEntities, ['slot_datetime']);
    }
};
exports.CalendarService = CalendarService;
exports.CalendarService = CalendarService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calendar_model_1.Calendar)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CalendarService);
//# sourceMappingURL=calendar.service.js.map