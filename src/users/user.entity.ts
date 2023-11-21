import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
@Entity()
class User{
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({unique: true})
    public email: string;

    @Column()
    public name: string;

    @Column()
    @Exclude()  // ici on indique de ne pas renvoyer dans la reponse le password a a l'utilisateur
    public password: string;
}

export default User;