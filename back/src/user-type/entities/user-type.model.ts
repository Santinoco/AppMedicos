import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.model";

@Entity()
export class UserType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true } )
    name: string;

    @OneToMany(() => User, user => user.type)
    users: User[];
}