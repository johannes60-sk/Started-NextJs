import Post from 'src/posts/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Category{
    @PrimaryGeneratedColumn() 
    public id: number;

    @Column()
    public name: string;

    @Column()
    // @ManyToMany(() => Post, (post: Post) => post.categories)
    public posts: Post[]
}