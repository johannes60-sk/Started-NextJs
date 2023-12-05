import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import UpdatePostDto from './dto/updatePost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Post from './post.entity';
import { Repository, In, FindManyOptions, MoreThan } from 'typeorm';
import createPostDto from './dto/createPost.dto';
import User from 'src/users/user.entity';
import PostNotFoundException from './exception/postNotFund.exception';
import PostsSearchService from './postsSearch.services';
 
@Injectable()
export default class PostsService {
  private lastPostId = 0;

constructor(
  @InjectRepository(Post)
  private postsRepository: Repository<Post>,
  private postsSearchService: PostsSearchService
) {}

// Retourne tous les post
async getAllPost(offset?: number, limit?: number, startId?: number){
  const where: FindManyOptions<Post>['where'] = {}; // pour specifier des options lors de la recherche. FindManyOptions prend l'entite et la propriete pour definir les conditions de la recherche(['where'])
  let separateCount = 0;
  if(startId){
    where.id = MoreThan(startId)  // condition de recherche spécifie de récupérer les entités Post avec un ID supérieur à startId
    separateCount = await this.postsRepository.count();
  }
  const [items, count] = await this.postsRepository.findAndCount({
    relations: ['author'], // pour chaque post les donnee de l'auteur sera aussi recuperer
    order: {
      id: 'ASC'
    },
    skip: offset,  // specifier le nbr d'enregristrement a ignorer avant de commencer par recup
    take: limit    // nbr maxi a recup
  });
  return {items,count: startId ? separateCount : count};
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
    ...post,
    author: user
  });
  await this.postsRepository.save(newPost);
  this.postsSearchService.indexPost(newPost);
  return newPost;
}

async searchForPosts(text: string, offset?: number, limit?: number ){
  const {results, count} = await this.postsSearchService.search(text);
  const ids = results.map(result => result.hits);
  if(!ids.length){
    return [];
  }
  return this.postsRepository.find({where: {id: In(ids)}})
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