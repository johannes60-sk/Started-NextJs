import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import UsersService from "src/users/users.service";
import TokenPayLoad from "./tokenPayload.interface";

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies.Authentification;
            }]),
            secretOrKey: configService.get('JWT_SECRET')
        });
    }

    async validate(playload: TokenPayLoad){
        return this.userService.getById(playload.userId);
    }
}