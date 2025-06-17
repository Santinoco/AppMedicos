import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.model";
import { AppointmentStatus } from "../../appointment-statuses/entities/appointment-status.model";
import { Doctor } from "src/doctors/entities/doctor.model";
import { Patient } from "src/patients/entities/patient.model";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column()
  hora: string;

  @Column()
  motivo: string;

  @Column({ default: 1 })
  estado_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.user_id)
  @JoinColumn({ name: "doctor_id"})
  doctor_id: number;

  @ManyToOne(() => Patient, (patient) => patient.user_id)
  @JoinColumn({ name: "patient_id" })
  patient_id: number;

  @ManyToOne(() => AppointmentStatus, (status) => status.status)
  @JoinColumn({ name: "estado_id", referencedColumnName: "status_id" })
  status: AppointmentStatus;

}
