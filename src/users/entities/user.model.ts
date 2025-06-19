import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Appointment } from "../../appointments/entities/appointment.model";
import { UserType } from "../../user-type/entities/user-type.model";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => UserType, (type) => type.users)
  @JoinColumn({ name: "user_type_id" })
  type: UserType;

}
