import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import UsersModule from "./users/users.module"
import { ConfigModule } from '@nestjs/config';  // Permet de configurer des variables d’environnement
import * as Joi from '@hapi/joi'; // permet de valider nos variables d’environnement en definisant un schema de validation
import { DatabaseModule } from './database/database.module';
import AuthenticationModule from './authentication/authentication.module';
import ExceptionsLoggerFilter from './utils/exceptionsLogger.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    PostsModule,
    ConfigModule.forRoot({    // Tout ceci permet de configurer un schema de validation pour les variables d'env
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
      })
    }),
    DatabaseModule,
    AuthenticationModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: ExceptionsLoggerFilter,
    // },
  ],
})
export class AppModule {}