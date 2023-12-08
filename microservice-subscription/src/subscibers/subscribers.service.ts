import { Injectable } from "@nestjs/common";
import Subscriber from "./subscriber.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateSubscriberDto from "./dto/CreateSubscriberDto";

@Injectable()
export default class SubscriberService{

    constructor(
        @InjectRepository(Subscriber)
        private subscriberRepository: Repository<Subscriber>){}

    async addSubscriber(subscriber: CreateSubscriberDto){
        const newSubscriber = await this.subscriberRepository.create(subscriber);
        await this.subscriberRepository.save(newSubscriber);
        return newSubscriber;
    }
    
        async getAllSubscribers(){
        return this.subscriberRepository.find();
    }
}