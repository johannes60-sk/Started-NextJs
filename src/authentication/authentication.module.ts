
import { Module } from '@nestjs/common';
import AuthenticationService from "./authentication.service"
import {UsersModule} from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import LocalStrategy from "./local.strategy"
import AuthenticationController from './authentication.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import JwtStrategy from './jwt.strategy';
import UsersService from 'src/users/users.service';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';

@Module({
    imports: [
        UsersModule, 
        PassportModule,
         ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (ConfigService: ConfigService)=> ({
                secret: ConfigService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${ConfigService.get('JWT_EXPIRATION_TIME')}s`,
                }
            })
        })],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
    controllers: [AuthenticationController],
})
export default class AuthenticationModule{}