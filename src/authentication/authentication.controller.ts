import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import AuthenticationService from "./authentication.service";
import RequestWithUser from './requestWithUser.interface';
import LocalAuthenticationGuard from "./localAuthentication.guard"
import RegisterDto from "./dto/register.dto";
import { Response } from "express";
import JwtAuthenticationGuard from "./jwt-authentication.guard";

@Controller('authentification')
export default class AuthenticationController{
    constructor(private readonly authenticationService: AuthenticationService){
    }

    @Post('register')
    async register(@Body() registrationData: RegisterDto){
        return this.authenticationService.register(registrationData);
    }  

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('Log-in')
    async logIn(@Req() request: RequestWithUser, @Res() response: Response){  //Utilise le décorateur @Req() pour injecter l'objet de requête HTTP étendu avec l'interface RequestWithUser
        const {user} = request;  //la déstructuration d'objet pour ne renvoyer que la partie user de la requete
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response){
        response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogout());
        return response.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser){  // verifie le jeton web json du user et si valide renvoie le user
        const user = request.user;
        user.password = undefined;
        return user;
    }
}