import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import Address from "./address.entity";
import Post from "../posts/post.entity";
import PublicFile from "src/files/publicFile.entity";
@Entity()
class Users{
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({unique: true})
    public email: string;

    @Column()
    public name: string;

    @Column()
    @Exclude()  // ici on indique de ne pas renvoyer dans la reponse le password a a l'utilisateur
    public password?: string;

    @OneToOne(() => Address,{ // son argument est une fonction qui renvoie la classe de l’entité avec laquelle nous voulons établir une relation.
    eager: true,   //ici on precise de renvoyer egalements les adresses quand on recupere les users
    cascade: true // grace a cette option on peut enregistrer une adresse tout en enregistrant un user dans la bd
    })  
    @JoinColumn()  // permet d'indiquer que l'entite user est proprietaire de la relation .Du coup dans la table user on aura adressId
    public address: Address;

    @OneToMany(() => Post, (post: Post) => post.author)
    public posts?: Post[];

    @JoinColumn()
    @OneToOne(
        () => PublicFile,
        {
            eager: true,
            nullable: true
        } 
    )
    public avatar?: PublicFile;
    
    /*  Le premier argument de @OneToMany est une fonction qui renvoie le type de l'entité cible (Post dans ce cas),
     et le deuxième argument est une fonction qui
     spécifie comment la relation est configurée.*/


}

export default Users;