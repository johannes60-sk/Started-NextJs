
import { Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Post from './post.entity';
import SearchModule from 'src/search/search.module';
import PostsSearchService from './postsSearch.services';

@Module({
   // imports est utilisée pour spécifier les modules dont dépend votre module actuel
   //ici j'ai utiliser la commande TypeOrmModule pour importer mon entite Post
   //Cela suggère que vous utilisez TypeORM pour interagir avec une base de données, 
   //et forFeature([Post]) indique que le module gère l'entité Post.
    imports: [
      TypeOrmModule.forFeature([Post]),
      SearchModule
  ],  
    controllers: [PostsController],
    providers: [PostsService, PostsSearchService],
  })
  export class PostsModule {}