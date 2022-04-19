import { USER_MS_PORT, FORUM_MS_PORT } from './../utils/constantes';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { ServiceSender } from 'src/users/service.sender';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS',
        transport: Transport.TCP,
        options: { port: USER_MS_PORT },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ServiceSender],
  exports: [UsersService],
})
export class UsersModule {}
