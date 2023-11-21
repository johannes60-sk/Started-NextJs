import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from 'class-transformer';
import Adress from "./address.entity";
import Post from "src/posts/post.entity";
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

    @OneToOne(() => Adress,{ // son argument est une fonction qui renvoie la classe de l’entité avec laquelle nous voulons établir une relation.
    eager: true,
    cascade: true // grace a cette option on peut enregistrer une adresse tout en enregistrant un user dans la bd
    })  //ici on precise de renvoyer egalements les adresses quand on recupere les users
    @JoinColumn()  // permet d'indiquer que l'entite user est proprietaire de la relation .Du coup dans la table user on aura adressId
    public adress: Adress;

    @OneToMany(() => Post, (post: Post) => post.author)
    public posts: Post[];

    /*  Le premier argument de @OneToMany est une fonction qui renvoie le type de l'entité cible (Post dans ce cas),
     et le deuxième argument est une fonction qui
     spécifie comment la relation est configurée.*/
}

export default User;