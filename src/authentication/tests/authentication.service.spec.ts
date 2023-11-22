
import AuthenticationService from '../authentication.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import User from '../../users/user.entity';
import UsersService from '../../users/users.service';
import { mockedConfigService } from '../../utils/mocks/config.service';
import {mockedJwtService} from '../../utils/mocks/jwt.service';
describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  beforeEach(async () => {  // mis en place de l'env de test ou les dépendances du service à tester sont remplacées par des versions simulées
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
            provide: getRepositoryToken(User),  // on  fournir un référentiel utilisateur simulé car on a enleve DatabaseModule etant donne que pour les tests on se connecte pas a la db reel 
            useValue: {},
        }
      ],
    }).compile();
    authenticationService = await module.get<AuthenticationService>(AuthenticationService); // recup du servive a tester
    
})
  describe('when creating a cookie', () => {
    it('should return a string', () => {   // le test
      const userId = 1;
      expect(
        typeof authenticationService.getCookieWithJwtToken(userId)
      ).toEqual('string')
    })
  })
});


/* Un sous-groupe de tests est créé pour décrire le comportement lors de la création d'un cookie. À l'intérieur de ce sous-groupe, 
un test spécifique est défini : il vérifie que la fonction getCookieWithJwtToken du service retourne une chaîne de caractères. */


//Nous devrions éviter d’importer nos modules lors de l’écriture de tests unitaires