import { Controller, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import UsersService from "./users.service";
import JwtAuthenticationGuard from "src/authentication/jwt-authentication.guard";
import RequestWithUser from "src/authentication/requestWithUser.interface";
import { Response } from 'express';
import { FileInterceptor } from "@nestjs/platform-express";
import FindOneParams from "src/utils/findOneParams";

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

    @Post('files')
    @UseGuards(JwtAuthenticationGuard)
    @UseInterceptors(FileInterceptor('file'))
    async addPrivateFile(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File){
        return this.usersService.addPrivateFile(request.user.id, file.buffer, file.originalname);
    }

    @Get('files/:id')
    @UseGuards(JwtAuthenticationGuard)
    async getPrivateFile(@Req() request: RequestWithUser, @Param() {id}: FindOneParams, @Res() res: Response){
        const file = await this.usersService.getPrivateFile(request.user.id, Number(id));
        file.stream.pipe(res); //elle permet de diriger les données du flux directement(file.stream) vers la réponse HTTP qui est renvoyée au client(res).
    }

    @Get('files')
    @UseGuards(JwtAuthenticationGuard)
    async getAllPrivateFiles(@Req() request: RequestWithUser){
        return this.usersService.getAllPrivateFiles(request.user.id);
    }
}