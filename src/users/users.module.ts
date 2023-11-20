import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./user.entity";
import UsersService from "./users.service";

@Module({
    imports:[TypeOrmModule.forFeature([User])],
    providers: [UsersService], 
    exports: [UsersService],  // ici j'export le  provider pour le rendre disponible en dehors du module et etre utilise
})

export default class UsersModule{}
