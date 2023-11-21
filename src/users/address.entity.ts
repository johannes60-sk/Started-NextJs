import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './user.entity';

@Entity()
export default class Adress{
    @PrimaryGeneratedColumn() 
    public id: number;

    @Column()
    public street: string;

    @Column()
    public city: string;

    @Column()
    public country: string;

    @OneToOne(() => User, (user: User) => user.adress) // ici on creer une relation inverse ce qui permet de rendre bidirectionnelle la relation entre adresse et user
    public user: User;
}