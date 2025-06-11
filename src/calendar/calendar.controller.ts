import { Controller, Get, Post } from '@nestjs/common';
import { CalendarService } from './calendar.service';

@Controller('calendar')
export class CalendarController {
    constructor(private readonly calendarService: CalendarService) {}

    @Post("generateslots")
    async generateSlots() {
        return this.calendarService.generateSlots();
    }

    @Get("getslots")
    async getSlots() {
        return this.calendarService.getSlots();
    }
}
