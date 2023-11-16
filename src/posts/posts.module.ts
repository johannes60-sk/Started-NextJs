
import { Module } from '@nestjs/common';
import PostsController from './posts.controller';
import PostsService from './posts.service';

@Module({
    imports: [],   // est utilisée pour spécifier les modules dont dépend votre module actuel
    controllers: [PostsController],
    providers: [PostsService],
  })
  export class PostsModule {}