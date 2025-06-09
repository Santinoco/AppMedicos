import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('calendar_slots')
@Unique(['slotDatetime'])
export class CalendarSlot {
  @PrimaryGeneratedColumn()
  slotId: number;

  @Column({ type: 'timestamp' })
  slotDatetime: Date;
}
