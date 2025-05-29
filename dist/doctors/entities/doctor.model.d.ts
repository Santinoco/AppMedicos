import { User } from "../../users/entities/user.model";
export declare class Doctor {
    user_id: number;
    user: User;
    specialty: string;
    license_number: number;
    active: boolean;
}
