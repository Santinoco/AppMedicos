import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique(['slot_datetime'])
export class Calendar {
  @PrimaryGeneratedColumn()
  slot_id: number;

  @Column({ type: 'timestamp' })
  slot_datetime: Date;
}
