import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import AuthenticationService from "./authentication.service";
import User from "src/users/user.entity";

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy){

    constructor(private authentificationService: AuthenticationService){
        // appele du constructeur de la class PassportStrategy et  on configure usernameField à 'email', indiquant que l'authentification sera basée sur le champ email des utilisateurs. 
        super({usernameField:'email'}); 
    }

    async validate(email: string, password: string): Promise<User>{ // La signature Promise<User> indique que la méthode renverra un objet de type User encapsulé dans une promesse.
        return this.authentificationService.getAuthenticatedUser(email, password);
    }
}