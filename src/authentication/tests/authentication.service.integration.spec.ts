import AuthenticationService from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import  UsersService  from '../../users/users.service';
import {mockedJwtService} from '../../utils/mocks/jwt.service';
import {mockedConfigService} from '../../utils/mocks/config.service';
import * as bcrypt from 'bcrypt';
import {mockedUser} from './user.mock';

jest.mock('bcrypt');
describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let bcryptCompare: jest.Mock;  //Une fonction mock pour simuler la fonction compare du module bcrypt.
  let userData: User;  
  let findUser: jest.Mock;    //Une fonction mock (jest.fn()) qui simulera la fonction findOne du usersRepository

  beforeEach(async () => {
    userData = {
        ...mockedUser,
    };
    findUser = jest.fn().mockResolvedValue(userData);
    const usersRepository = {
        findOne: findUser,
    };

    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService
        },
        {
          provide: JwtService,
          useValue: mockedJwtService
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository
        }
      ],
    })
      .compile();
    authenticationService = await module.get(AuthenticationService);
    usersService = await module.get(UsersService);
  })
  //1er test
  describe('when accessing the data of authenticating user', () => {
    beforeEach(() => {
        bcryptCompare.mockReturnValue(false);   //simule le scénario où la comparaison de hachage avec bcrypt échoue.Ici Il est config pour renvoyer false
    });
    /**  cet test verifie que getAuthenticatedUser est call avec un email et un password et que le hachage du password echoue, une erreur est donc lance 
     * le but de ce test est de vérifie le comportement AuthenticationService dans le cas où la comparaison de hachage avec bcrypt échoue, 
     * en s'assurant qu'une erreur est correctement gérée.
    */
    it('should throw an error', async () => { 
        await expect(
            authenticationService.getAuthenticatedUser('user@email.com','strongPassword')
        ).rejects.toThrow();
    })
  })

  // 2eme test
  describe('and the provided password is valid', () => {
    beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
    });
    // 3eme test
    describe('and the user is found in the database', () => {
        beforeEach(() => {
            findUser.mockResolvedValue(userData); //simule le scénario où la fonction findOne du usersRepository renvoie avec succès les données d'un user.
        })
        it('should return the user data',async () => {
            const user = await authenticationService.getAuthenticatedUser('user@email.com', 'strongPassword');
            expect(user).toBe(userData); //vérifie que l'objet user retourné par la fonction getAuthenticatedUser est identique à l'objet userData
        })
    })
    //4eme test
    describe('and the user is not found in the database', () => {
        beforeEach(() => {
            findUser.mockResolvedValue(undefined);  
        })
        it('should throw an error',async () => {
            await expect(
                authenticationService.getAuthenticatedUser('user@email.com', 'strongPassword')
                ).rejects.toThrow();
        })
    })
  })
});