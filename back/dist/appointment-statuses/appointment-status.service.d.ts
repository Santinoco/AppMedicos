import { Repository } from "typeorm";
import { AppointmentStatus } from "./entities/appointment-status.model";
export declare class AppointmentStatusService {
    private appointmentStatusRepository;
    constructor(appointmentStatusRepository: Repository<AppointmentStatus>);
    getAllStatuses(): Promise<AppointmentStatus[]>;
    getStatusById(status_id: number): Promise<AppointmentStatus | null>;
    createStatus(statusData: any): Promise<AppointmentStatus[]>;
}
