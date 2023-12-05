import { Body, ClassSerializerInterceptor, Controller, Get, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import AuthenticationService from "./authentication.service";
import RequestWithUser from './requestWithUser.interface';
import LocalAuthenticationGuard from "./localAuthentication.guard"
import RegisterDto from "./dto/register.dto";
import { Response } from "express";
import JwtAuthenticationGuard from "./jwt-authentication.guard";
import UsersService from "src/users/users.service";
import { JwtRefreshGuard } from "./jwt-refresh.guard";

@Controller('authentification')
@UseInterceptors(ClassSerializerInterceptor) // permet d'appliquer le decorateur (@exclude) mis au niveau du password pour ne pas qu'il soit renvoyer dans la reponse au user
export default class AuthenticationController{
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly usersService: UsersService)
        {}

    @Post('register')
    async register(@Body() registrationData: RegisterDto){
        return this.authenticationService.register(registrationData);
    }  

    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('Log-in')
    async logIn(@Req() request: RequestWithUser){  //Utilise le décorateur @Req() pour injecter l'objet de requête HTTP étendu avec l'interface RequestWithUser
        const {user} = request;  //la déstructuration d'objet pour ne renvoyer que la partie user de la requete
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(user.id);
        const {cookie: refreshTokenCookie, token: refreshToken} = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
        await this.usersService.setCurrentRefreshToken(refreshToken, user.id) // hachage du refreshToken
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        // user.password = undefined;
        return user;
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('Log-out')
    @HttpCode(200)
    async logOut(@Req() request: RequestWithUser){
        await this.usersService.removeRefreshToken(request.user.id);
        request.res.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
        // return request.res.sendStatus(200);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser){  // verifie le jeton web json du user et si valide renvoie le user
        const user = request.user;
        // user.password = undefined;
        return user;
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser){
        const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(request.user.id);
        console.log(accessTokenCookie)
        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }

}