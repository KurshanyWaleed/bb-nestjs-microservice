import {
  BadGatewayException,
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices/client';
import { USERS } from '../utils/constantes';

@Injectable()
export class ServiceSender
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(@Inject('USERS') private readonly usersService: ClientProxy) {}

  onApplicationShutdown(signal?: string) {
    this.usersService
      .close()
      .then(() => console.log('API-GATEWAY DISCONNECTED To USERS MS'));
    // this.usersService
    //   .close()
    //   .then(() => console.log('API-GATEWAY DISCONNECTED to FORUM MS'));
  }

  sendThisDataToMicroService(pattern: any, data: any, service: string) {
    switch (service) {
      case USERS:
        return this.usersService.send(pattern, data);
      // case FORUM:
      //   return this.forumService.send(pattern, data);
      default:
        return null;
    }
  }

  async onApplicationBootstrap() {
    await this.usersService
      .connect()
      .then(() =>
        console.log(
          'API-GATEWAY connected successfully to USER-MICROSERVICE 🔗✨',
        ),
      )
      .catch((e) => {
        new BadGatewayException(e);
        console.info(
          '[WAITING] The remote USER-Microsercice do not response ...🦕🦕 ',
        );
      });
    // await this.forumService
    //   .connect()
    //   .then(() =>
    //     console.log(
    //       'API-GATEWAY connected successfully to FORUM-MICROSERVICE 🔗✨',
    //     ),
    //   )
    //   .catch((e) => {
    //     new BadGatewayException(e);
    //     console.info(
    //       '[WAITING] The remote FORUM-Microsercice do not response ...🦕🦕🦕 ',
    //     );
    //   });
  }
}
