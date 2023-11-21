import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


@Injectable()
//permet lorsqu'on la met sur une route d'exiger l'auth avant d'acceder a cette route 
export default class JwtAuthenticationGuard extends AuthGuard('jwt'){}



// lorsque vous créez un fichier jwt.strategy.ts et que vous définissez votre stratégie JWT à l'intérieur 
//de cette classe, la classe JwtAuthenticationGuard (qui étend AuthGuard('jwt')) utilise automatiquement cette stratégie
//PS: le non du fichier ou on definie la strategy peut etre nomme comme on veut