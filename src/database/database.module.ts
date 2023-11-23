import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
 import Post from '../posts/post.entity'
import Users from '../users/user.entity';
import Adress from '../users/address.entity';
import Category from '../categories/category.entity';
import PublicFile from '../files/publicFile.entity';

//Dès que nous créons un fichier .env à la racine de notre application,
// NestJS les injecte dans un ConfigSerivice

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],  // j'importe ici le schema de validation des variable env
      inject: [ConfigService],  // configService contient nos variables d'env
      useFactory: (configService: ConfigService) => ({  //useFactory permet d’accéder aux variables d’environnement
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [Post, Users, Adress, Category, PublicFile],  
        //   __dirname + '/../**/*.entity.ts',
        synchronize: true,
      })
    }),
  ],
})
export class DatabaseModule {}