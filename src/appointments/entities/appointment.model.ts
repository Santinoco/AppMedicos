import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.model";

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

  @Column({ default: "Pendiente" })
  estado: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.appointments)
  @JoinColumn({ name: "userId" })
  user: User;
}
