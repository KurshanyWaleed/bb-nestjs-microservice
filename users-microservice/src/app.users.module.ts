import { Administration, AdministrationSchema } from './models/users.model';
import { AuthModule } from './auth/auth.module';
import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/users.model';
import { UsersController } from './app.users.controller';
import { UsersService } from './app.users.service';
import { TokenAnalyse } from './analyse.token';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from './user.mail.config.services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ServiceSender } from './activities.m.service';
import { ACTIVITIES_MS_PORT } from './utils/constantes';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    forwardRef(() => AuthModule),
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get<string>('EMAIL'),
            pass: config.get('PASS'),
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: async (configservice: ConfigService) => ({
        secret: configservice.get<string>('SECRET'),
        signOptions: {
          expiresIn: configservice.get<string>('JWT_EXPIRATION_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_CONNXION'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Administration.name, schema: AdministrationSchema },
    ]),
    ClientsModule.register([
      {
        name: 'ACTIVITIES',
        transport: Transport.TCP,
        options: { port: ACTIVITIES_MS_PORT },
      },
    ]),
  ],

  controllers: [UsersController],
  providers: [UsersService, TokenAnalyse, EmailService, ServiceSender],
  exports: [UsersService],
})
export class UsersModule {}