import { ACTIVITIES, FORUM } from './utils/constantes';
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
  activitiesIsConnected: boolean;
  forumIsConnected: boolean;

  constructor(
    @Inject(ACTIVITIES) private readonly activitiesService: ClientProxy,
    @Inject(FORUM) private readonly forumService: ClientProxy,
  ) {}

  onApplicationShutdown(signal?: string) {
    this.activitiesService
      .close()
      .then(() => console.log('API-GATEWAY DISCONNECTED To ACITIVITES MS'));
    this.forumService
      .close()
      .then(() => console.log('API-GATEWAY DISCONNECTED to FORUM MS'));
  }

  sendThisDataToMicroService(pattern: any, data: any, service: string) {
    switch (service) {
      case ACTIVITIES:
        return this.activitiesService.send(pattern, data);
      case FORUM:
        return this.forumService.send(pattern, data);
      default:
        return null;
    }
  }
  emitThisDataToMicroService(pattern: any, data: any, service: string) {
    switch (service) {
      case ACTIVITIES:
        return this.activitiesService.emit(pattern, data);
      case FORUM:
        return this.forumService.emit(pattern, data);
      default:
        return null;
    }
  }
  async onApplicationBootstrap() {
    await this.activitiesService
      .connect()
      .then(() => {
        console.log(
          'API-GATEWAY connected successfully to ACITIVITES-MICROSERVICE 🔗✨',
        );
        this.activitiesIsConnected = true;
      })
      .catch((e) => {
        new BadGatewayException(e);
        console.info(
          '[WAITING] The remote ACTIVITIES-Microsercice do not response ...🦕🦕 ',
        );
        this.activitiesIsConnected = false;
      });
    await this.forumService
      .connect()
      .then(() => {
        console.log(
          'API-GATEWAY connected successfully to FORUM-MICROSERVICE 🔗✨',
        );
        this.forumIsConnected = false;
      })
      .catch((e) => {
        this.forumIsConnected = false;
        new BadGatewayException(e);
        console.info(
          '[WAITING] The remote FORUM-Microsercice do not response ...🦕🦕🦕 ',
        );
      });
  }
  onConnectFromActivities() {
    this.activitiesService

      .connect()
      .then((data) => true)
      .catch((e) => e);
    this.activitiesIsConnected = false;
  }
  onConnectFromForum() {
    this.activitiesService

      .connect()
      .then((data) => true)
      .catch((e) => e);
    this.forumIsConnected = false;
  }

  isInstanceOf() {
    const service = this.isInstanceOf();
    return { service };
  }
}
