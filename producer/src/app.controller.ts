import {
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly appService: AppService,
    @Inject('any_name_i_want') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['test2'].forEach((key) => this.client.subscribeToResponseOf(`${key}`));
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka-test')
  testKafka() {
    return this.client.emit('test2', {
      foo: 'bar',
      data: new Date().toString(),
    });
  }

  @Get('kafka-test-with-response')
  async testKafkaWithResponse() {
    const a = await this.client.send('test2', {
      messages: [{ key: 'key1', value: 'hello world', partition: 0 }],
      partition: 0,
      headers: {
        partition: 1,
      },
    });

    // await this.client.send('test2', {
    //   foo: 'barxxxxx2w222',
    //   data: new Date().toString(),
    //   partition: 1,
    // });
    console.log('a: ');
    return a;
  }
}
