import UsersService from "../users/users.service";
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import RegisterDto from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayLoad from "./tokenPayload.interface";
import { PostgresErrorCode } from "../database/postgresErrorCodes.enum";

@Injectable()
export default class AuthenticationService{

    constructor(
        private readonly usersService:UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
        ){}

        public async register(registrationData: RegisterDto) {
            const hashedPassword = await bcrypt.hash(registrationData.password, 10);
            try {
                // console.log(registrationData)
    
                const createdUser = await this.usersService.createNewUser({
                    ...registrationData,
                    password: hashedPassword
                });

                console.log("registrationData")

                // createdUser.password = undefined;
                return createdUser;
            } catch (error) {

                if(error?.code === PostgresErrorCode.UniqueViolation){
                    throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
                }
                console.error(error);
                throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
   
    public async getAuthenticatedUser(email: string, plainTextPassowrd: string){  //verifie si l'utilisateur existe pour le connecter
        try{
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(plainTextPassowrd, user.password)
            user.password = undefined;  // ici pour des raison de securite on ne renvoie pas le password
            return user;
        }catch(error){
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }

    }

    private async verifyPassword(plainTextPassowrd: string, hashedPassword: string){
        const isPasswordMatching = await bcrypt.compare(plainTextPassowrd, hashedPassword)
        if(!isPasswordMatching){
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);

        }
    }

    public getCookieWithJwtToken(userId: number){  // configuration du jeton a renvoyer au user apres qu'il soit login
        const playload: TokenPayLoad  = {userId};
        const token = this.jwtService.sign(playload);
        return `Authentification=${token}; HttOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`; 
    }

    public getCookieForLogOut(){
        return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
        
    }
}