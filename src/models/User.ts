import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number

    @Column({unique: true})
    email!: string

    @Column({unique: true})
    username!: string

    @Column()
    firstName!: string

    @Column()
    lastName!: string

    @Column()
    password!: string

}
