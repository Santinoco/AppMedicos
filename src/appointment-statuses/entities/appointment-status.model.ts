import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class AppointmentStatus {
  @PrimaryGeneratedColumn()
  status_id: number;

  @Column({ length: 50 })
  status: string;
}