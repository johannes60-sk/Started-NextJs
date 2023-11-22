import AuthenticationService from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import  UsersService  from '../../users/users.service';
import {mockedJwtService} from '../../utils/mocks/jwt.service';
import {mockedConfigService} from '../../utils/mocks/config.service';
import  AuthenticationController  from '../authentication.controller';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import {mockedUser} from './user.mock';

describe('The AuthenticationController', () => {
    let app: INestApplication;
    let userData: User;

    beforeEach(async () => {
        userData = {
            ...mockedUser,
        };
        const usersRepository = {
            create: jest.fn().mockResolvedValue(userData),
            save: jest.fn().mockReturnValue(Promise.resolve()),
        };

        const module = await Test.createTestingModule({
            controllers: [AuthenticationController],
            providers: [
                UsersService,
                AuthenticationService,
                {
                    provide: ConfigService,
                    useValue: mockedConfigService,
                },

                {
                    provide: JwtService,
                    useValue: mockedJwtService
                },

                {
                    provide: getRepositoryToken(User),
                    useValue: usersRepository,
                },
            ],
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();
    });
    describe('when registering', () => {
        // 1er test
        describe('and using valid data', () => {
            it('should respond with the data of the user without the password', () => {
                const expectedData = {
                    ...userData,
                };
                delete expectedData.password;
                return request(app.getHttpServer())  //envoie une requête HTTP à l'application, utilisant le serveur HTTP sous-jacent
                    .post('/authentification/register')
                    .send({
                        email: mockedUser.email,
                        name: mockedUser.name,
                        password: 'strongPassword',
                    })
                    .expect(201)   //Attend une réponse HTTP avec le code de statut 201
                    .expect(expectedData);   //Attend que le corps de la réponse soit égal à l'objet 
            });
        });
        // 2eme test
        describe('and using invalid data', () => {
            it('should throw an error', () => {
                return request(app.getHttpServer())
                    .post('/authentification/register')
                    .send({
                        name: mockedUser.name
                    })
                    .expect(400);
            })
        })
    })
})

