import { CalendarService } from './calendar.service';
export declare class CalendarController {
    private readonly calendarService;
    constructor(calendarService: CalendarService);
    generateSlots(): Promise<void>;
    getSlots(): Promise<import("./entities/calendar.model").Calendar[]>;
    getDoctorAppointments(doctorUserId: number): Promise<import("../appointments/entities/appointment.model").Appointment[]>;
    getDoctorAvailableSlots(doctorUserId: number): Promise<import("./entities/calendar.model").Calendar[]>;
}
