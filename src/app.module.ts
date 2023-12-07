import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Subscriber from './subscibers/subscriber.entity';
import SubscribersModule from './subscibers/subscribers.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import SubscribersController from './subscibers/subscribers.controller';
import SubscriberService from './subscibers/subscribers.service';
import DatabaseModule from './database/database.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriber]), // permet d'indiquer quel entite le module va utiliser 
    SubscribersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number()
      })
    })
  ],
  controllers: [SubscribersController],
  providers: [SubscriberService],
})
export class AppModule {}