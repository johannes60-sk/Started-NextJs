import Category from 'src/categories/category.entity';
import User from 'src/users/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
class Post {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @Column()
    public content: string;

    @Column({ nullable: true})
    public category?: string;

    // @ManyToOne(() => User, (author: User) => author.posts)
    public author: User;

    // @ManyToMany(() => Category, (category: Category) => category.posts)
    // @JoinTable()   // TypeORM a mis en place une table supplémentaire. De cette façon, ni la table Post ni la table Category ne stockent les données relatives à la relation. Et le ce decorateur doit etre utiliser d'un cote de la relation
    // public categories: Category[];
}

export default Post