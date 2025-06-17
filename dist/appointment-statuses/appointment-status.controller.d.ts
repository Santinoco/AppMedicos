import { AppointmentStatusService } from "./appointment-status.service";
export declare class AppointmentStatusController {
    private readonly statusService;
    constructor(statusService: AppointmentStatusService);
    getAllStatuses(): Promise<import("./entities/appointment-status.model").AppointmentStatus[]>;
    getStatusById(status_id: number): Promise<import("./entities/appointment-status.model").AppointmentStatus | null>;
    createStatus(statusData: any): Promise<import("./entities/appointment-status.model").AppointmentStatus[]>;
}
