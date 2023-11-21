import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./user.entity";
import UsersService from "./users.service";
import UsersController from "./users.controller";

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UsersService], 
    controllers: [UsersController],
    exports: [UsersService], // ici j'export le  provider pour le rendre disponible en dehors du module et etre utilise
})

export default class UsersModule{}
