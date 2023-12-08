import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import SubscriberService from './subscribers.service';
import CreateSubscriberDto from './dto/CreateSubscriberDto';
import { Controller } from '@nestjs/common';

@Controller()
export default class SubscribersController{
    constructor(
        private readonly subscribersService: SubscriberService
    ){}

    @MessagePattern({cmd: 'add-subscriber'})  // gestionnaire d'ecoute
    // @EventPattern({ cmd: 'add-subscriber' })
    async addSubscriber(@Payload() subscriber: CreateSubscriberDto, @Ctx() context: RmqContext){
        return this.subscribersService.addSubscriber(subscriber);
    }

    @MessagePattern({ cmd: 'get-all-subscribers' })
   async  getAllSubscribers() {
    return this.subscribersService.getAllSubscribers();
  }

    
}