import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import PostsService from './posts.service' 
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import FindOneParams from 'src/utils/findOneParams';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { PaginationParams } from 'src/utils/types/paginationParams';

@Controller('posts')
export default class PostsController{
    constructor(private readonly postsService:PostsService){} // readonly permet d'initialiser une seule fois la variable , sa valeur ne peut être modifiée après l'initialisation

    @Get()
    getPosts(
      @Query('search') search: string,  // indique que le paramètre search doit être extrait des paramètres de requête de la requête HTTP et sera stockée dans la variable search
      @Query() { offset, limit}: PaginationParams
      ){
      if(search){
        return this.postsService.searchForPosts(search, offset, limit);
      }
        return this.postsService.getAllPost(offset, limit);
    }

    @Get(':id')
    getPostById(@Param() {id}: FindOneParams){  //au lieu de faire ceci: [@Param('id')id: string] on a utiliser la classe-validator pour verifier le parametre
        return this.postsService.getPostById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard) // impose une auth avant d'acceder a la route
    async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser) {
      return this.postsService.createPost(post, req.user);
    }
   
    // @Put(':id')
    // async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    //   return this.postsService.replacePost(Number(id), post);
    // }
   
    @Delete(':id')
    async deletePost(@Param('id') id: string) {
      this.postsService.deletePost(Number(id));
    }
}