import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
//permet lorsqu'on la met sur une route d'exiger l'auth avant d'acceder a cette route 
export default class JwtAuthenticationGuard extends AuthGuard('jwt'){}