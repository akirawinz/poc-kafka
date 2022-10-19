import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('test2')
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    console.log('context: ', context);
    console.log('message: ', message);
    const originalMessage = context.getMessage();
    const response =
      `Receiving a new message from topic: consumer1: xxx` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }
}
