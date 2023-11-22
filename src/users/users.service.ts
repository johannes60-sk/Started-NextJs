import { Repository } from 'typeorm';
import Users from "./user.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from "./dto/createUser.dto";

@Injectable()
export default class UsersService{
    
    constructor(
        @InjectRepository(Users)  
        private usersRepository: Repository<Users>
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
}