import Post from '../posts/post.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Category{
    @PrimaryGeneratedColumn() 
    public id: number;

    @Column()
    public name: string;

    @ManyToMany(() => Post, (post: Post) => post.categories)
    public posts: Post[]
}