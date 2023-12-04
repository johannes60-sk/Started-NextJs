import { Repository } from 'typeorm';
import Users from "./user.entity";
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import CreateUserDto from "./dto/createUser.dto";
import FilesService from 'src/files/files.service';
import { PrivateFilesService } from 'src/privateFile/privateFiles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class UsersService{
    
    constructor(
        @InjectRepository(Users)  
        private usersRepository: Repository<Users>,
        private readonly filesService: FilesService,
        private readonly privateFilesServices: PrivateFilesService
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

        async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string){
            return this.privateFilesServices.uploadPrivateFile(imageBuffer, userId, filename);
        }

        async getPrivateFile(userId: number, fileId: number){
            const file = await this.privateFilesServices.getPrivateFile(fileId);
            if(file.info.owner.id === userId){
                return file;
            }
            throw new UnauthorizedException();

        }

        async getAllPrivateFiles(userId: number){
           const userWithFiles = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['files']
           });
           if(userWithFiles){
            return Promise.all(
                userWithFiles.files.map(async (file) => {
                    const url = await this.privateFilesServices.generatePresignedurl(file.key);
                    return{  // renvoie toute les propertes de file et y ajoute egalement la propriete url
                        ...file,
                        url
                    }
                })
            )
           }
           throw new NotFoundException('User with id does not exist');
        }

        async setCurrentRefreshToken(refreshToken: string, userId: number){
            const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
            await this.usersRepository.update(userId, {
                currentHashedRefreshToken
            }); 
        }

        async getUserIfRefreshTokenMatches(refreshToken: string, userId: number){
            const user = await this.getById(userId);
            const isRefreshTokenMatching = await bcrypt.compare(
                refreshToken,
                user.currentHashedRefreshToken
            );

            if(isRefreshTokenMatching){
                return user;
            }

            return "tu n'est pas authorise a rafraichir un new token";
        }

        async removeRefreshToken(userId: number){
            return this.usersRepository.update(userId, {
                currentHashedRefreshToken: null
            });
        }
    }
