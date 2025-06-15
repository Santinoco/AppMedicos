import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Appointment } from '../../appointments/entities/appointment.model';

@Entity()
@Unique(['slot_datetime'])
export class Calendar {
  @PrimaryGeneratedColumn()
  slot_id: number;

  @Column({ type: 'timestamptz' })
  slot_datetime: Date;

  @OneToMany(() => Appointment, (appointment) => appointment.slot_datetime)
  appointments: Appointment[];
}
