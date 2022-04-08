import {
  BadGatewayException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';

@Injectable()
export class ServiceSender
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(@Inject('ACTIVITIES') private readonly service: ClientProxy) {}
  isConnected: boolean;
  onApplicationShutdown(signal?: string) {
    this.service
      .close()
      .then(() => console.log('client ACTIVIRIES desconnected'));
  }

  sendThisDataToMicroService(pattern: any, data: any) {
    return this.service.send(pattern, data);
  }
  emitThisDataToMicroService(pattern: any, data: any) {
    try {
      this.service.emit(pattern, data);
      return { isDone: true };
    } catch (e) {
      return new BadGatewayException(e);
    }
  }

  async onApplicationBootstrap() {
    await this.service
      .connect()
      .then(() => {
        console.log('Client is connected to activities MS 🔗✨');
        this.isConnected = true;
      })
      .catch((e) => {
        new BadGatewayException(e);
        this.isConnected = false;
        console.info(
          '[WAITING] The remote ACITVITIES-Microsercice do not response ...🦕🦕🦕 ',
        );
      });
  }
  Connect() {
    this.service

      .connect()
      .then((data) => true)
      .catch((e) => e);
  }
}
