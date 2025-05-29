import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.model";
import { AppointmentStatus } from "../../appointment-statuses/entities/appointment-status.model";

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

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => AppointmentStatus, (status) => status.status)
  @JoinColumn({ name: "estado_id", referencedColumnName: "status_id" })
  status: AppointmentStatus;

}
