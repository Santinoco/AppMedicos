import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToOne,
} from "typeorm";
import { User } from "../../users/entities/user.model";
import { AppointmentStatus } from "../../appointment-statuses/entities/appointment-status.model";
import { Doctor } from "../../doctors/entities/doctor.model";
import { Patient } from "../../patients/entities/patient.model";
import { Calendar } from "../../calendar/entities/calendar.model";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Calendar, (calendar) => calendar.slot_datetime)
  @JoinColumn({ name: "slot_id", referencedColumnName: "slot_id" })
  slot_datetime: Calendar;

  @Column()
  motivo: string;

  @Column({ default: 1 })
  estado_id: number;

  @ManyToOne(() => Doctor, (doctor) => doctor.user_id)
  @JoinColumn({ name: "doctor_id"})
  doctor_id: number;

  @ManyToOne(() => Doctor, doctor => doctor.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.user_id)
  @JoinColumn({ name: "patient_id" })
  patient_id: number;

  @ManyToOne(() => Patient, patient => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @ManyToOne(() => AppointmentStatus, (status) => status.status)
  @JoinColumn({ name: "estado_id", referencedColumnName: "status_id" })
  status: AppointmentStatus;

}
