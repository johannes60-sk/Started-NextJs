import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './post.entity';
import { Repository, In } from 'typeorm';
import createPostDto from './dto/createPost.dto';
import User from 'src/users/user.entity';
import PostNotFoundException from './exception/postNotFund.exception';
 
@Injectable()
export default class PostsService {
  private lastPostId = 0;

constructor(
  @InjectRepository(Post)
  private postsRepository: Repository<Post>
) {}

// Retourne tous les post
getAllPost(){
  return this.postsRepository.find();
  // return this.postsRepository.find({relations: ['author']});
}

//prend l'id d'un post et le retourne
async getPostById(id: number){
  const post = await this.postsRepository.findOne({where: {id}});
  // const post = await this.postsRepository.findOne({where: {id}, relations: {author: true}});
  if(post){
    return post;
  }
  throw new PostNotFoundException(id);
}

// Creer un nouveau post et le retourne
async createPost(post: createPostDto, user: User){
  const newPost = this.postsRepository.create({
    ...post
    // author: user
  });
  await this.postsRepository.save(newPost);
  return newPost;
}

// met a jour un post et le retourne 
async updatePost(id: number, post: UpdatePostDto){
  await this.postsRepository.update(id, post);
  const updatePost = this.postsRepository.findOne({where:{id}});
  if(updatePost){
    return updatePost;
  }
  throw new HttpException('Post not found',HttpStatus.NOT_FOUND);
}

//supprime un post
async deletePost(id:number){
  const deleteResponse = await this.postsRepository.delete(id);
  if(!deleteResponse.affected){ // la propriete affected indique le nombre de lignes affectées par la requête de suppression
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}

 
 //L’un des avantages des contrôleurs NestJS est qu’ils gèrent très bien les erreurs asynchrones. 
}