import { CalendarService } from './calendar.service';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    generateSlots(): Promise<void>;
    getSlots(): Promise<import("./entities/calendar.model").Calendar[]>;
}
