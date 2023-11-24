import Users from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class PrivateFile{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public key: string

    @ManyToOne(() => Users, (owner: Users) => {owner.files})
    public owner: Users;

}