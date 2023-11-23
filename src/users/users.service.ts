import { Repository } from 'typeorm';
import Users from "./user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from "./dto/createUser.dto";
import FilesService from 'src/files/files.service';

@Injectable()
export default class UsersService{
    
    constructor(
        @InjectRepository(Users)  
        private usersRepository: Repository<Users>,
        private readonly filesService: FilesService
        ){}

    async getByEmail(email: string){
        const user = await this.usersRepository.findOne({where: {email}})
        if(user){
            return user;
        }
        throw new HttpException('Users with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async getById(id: number){
        const user = await this.usersRepository.findOne({where: {id}});
        if(user){
            return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async createNewUser(userData: CreateUserDto) {
        const newUser = await this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }

    async addAvatar(userId: number, imageBuffer: Buffer, filename: string){
        const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
        const user = await this.getById(userId);
        await this.usersRepository.update(userId, {
            ...user,
            avatar
        });
        return avatar;
    }

    /*  lorsqu’un utilisateur télécharge un avatar alors qu’il en a déjà un, nous supprimons l’ancien*/
    async deleteAvatar(userId: number){
        const user = await this.getById(userId);
        const fileId = user.avatar?.id;
        if(fileId){
            await this.usersRepository.update(userId, {
                ...user,
                avatar: null
            });
            await this.filesService.deletePublicFile(fileId)
            }
        }
    }
