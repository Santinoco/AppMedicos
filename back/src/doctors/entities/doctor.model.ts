import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { User } from "../../users/entities/user.model";
import { Appointment } from "../../appointments/entities/appointment.model";

@Entity()
export class Doctor {
  @PrimaryColumn()
  user_id: number;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ length: 100, nullable: true })
  specialty: string;

  @Column({ type: 'time', nullable: true })
  shift_start: string;

  @Column({ type: 'time', nullable: true })
  shift_end: string;

  getShiftStart(): string {
    return this.shift_start;
  }

  setShiftStart(value: string): void {
    this.shift_start = value;
  }

  getShiftEnd(): string {
    return this.shift_end;
  }

  setShiftEnd(value: string): void {
    this.shift_end = value;
  }

  @Column({ nullable: true })
  license_number: number;

  @Column({ default: true, nullable: true })
  active: boolean;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor_id)
  appointments: Appointment[];

}