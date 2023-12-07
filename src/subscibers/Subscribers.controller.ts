import { MessagePattern } from '@nestjs/microservices';
import SubscriberService from './subscribers.service';
import CreateSubscriberDto from './dto/CreateSubscriberDto';
import { Controller } from '@nestjs/common';

@Controller()
export default class SubscribersController{
    constructor(
        private readonly subscribersService: SubscriberService
    ){}

    @MessagePattern({cmd: 'add-subscriber'})  // gestionnaire d'ecoute
    addSubscriber(subscriber: CreateSubscriberDto){
        return this.subscribersService.addSubscriber(subscriber);
    }

    @MessagePattern({ cmd: 'get-all-subscribers' })
    getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }

    
}