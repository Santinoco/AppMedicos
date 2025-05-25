import { Column, Model, Table, HasMany } from 'sequelize-typescript';
import { Appointment } from './appointment.model';

@Table
export class User extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  nombre: string;

  @Column
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @Column({ defaultValue: true })
  activo: boolean;

  @HasMany(() => Appointment)
  appointments: Appointment[];
}