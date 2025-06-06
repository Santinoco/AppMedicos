import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.model";
import { Appointment } from "src/appointments/entities/appointment.model";

@Entity()
export class Doctor {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ length: 100 })
  specialty: string;

  @Column()
  license_number: number;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor_id)
  appointments: Appointment[];
}