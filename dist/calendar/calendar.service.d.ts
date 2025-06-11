import { Calendar } from './entities/calendar.model';
import { Repository } from 'typeorm';
export declare class CalendarService {
    private readonly slotRepository;
    constructor(slotRepository: Repository<Calendar>);
    generateSlots(): Promise<void>;
    getSlots(): Promise<Calendar[]>;
}
