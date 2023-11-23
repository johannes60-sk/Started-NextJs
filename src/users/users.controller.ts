import { Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import UsersService from "./users.service";
import JwtAuthenticationGuard from "src/authentication/jwt-authentication.guard";
import RequestWithUser from "src/authentication/requestWithUser.interface";
import { Express } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('users')
export default class UsersController{

    constructor(private readonly usersService: UsersService) {}

    @Post('avatar')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File){
        console.log('avatar')
        return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
    }

  
}