import { User } from "../../users/entities/user.model";
export declare class Patient {
    user_id: number;
    user: User;
    completed_consultations: number;
    health_insurance: string;
    medical_history: string;
    weight: number;
    height: number;
    blood_type: string;
}
