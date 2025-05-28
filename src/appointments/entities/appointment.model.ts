import { Column, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../users/entities/user.model';

@Table
export class Appointment extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  declare id: number;

  @Column
  fecha: Date;

  @Column
  hora: string;

  @Column
  motivo: string;

  @Column({ defaultValue: 'Pendiente' })
  estado: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
