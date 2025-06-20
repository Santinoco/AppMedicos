import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  location_id: number;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 100 })
  province: string;

  @Column({ length: 100 })
  country: string;
}