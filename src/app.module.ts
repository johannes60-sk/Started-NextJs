import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';  // Permet de configurer des variables d’environnement
import * as Joi from '@hapi/joi'; // permet de valider nos variables d’environnement en definisant un schema de validation
import { DatabaseModule } from './database/database.module';

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
    DatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}