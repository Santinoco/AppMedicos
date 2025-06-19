import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.model";
import { Appointment } from "src/appointments/entities/appointment.model";

@Entity()
export class Patient {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column()
  completed_consultations: number;

  @Column({ length: 100 })
  health_insurance: string;

  @Column({ type: "text", nullable: true })
  medical_history: string;

  @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
  weight: number;

  @Column({ type: "numeric", precision: 5, scale: 2, nullable: true })
  height: number;

  @Column({ length: 5, nullable: true })
  blood_type: string;

  @OneToMany(() => Appointment, (appointment) => appointment.patient_id)
  appointments: Appointment[];
  
}