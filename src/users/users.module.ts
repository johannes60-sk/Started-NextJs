import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import User from "./user.entity";
import UsersService from "./users.service";
import UsersController from "./users.controller";
import { FilesModule } from "../files/files.module";


@Module({
    imports:[
        TypeOrmModule.forFeature([User]),
        FilesModule,
    ],
    providers: [UsersService], 
    controllers: [UsersController],
    exports: [UsersService], // ici j'export le  provider pour le rendre disponible en dehors du module et etre utilise
})

export class UsersModule{}
