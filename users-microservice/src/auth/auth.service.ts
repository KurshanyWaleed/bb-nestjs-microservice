import { MEMBER } from './../utils/constantes';
import { ConfigService } from '@nestjs/config';
import { LogInDto } from './../models/users.dto';
import { UsersService } from './../app.users.service';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ADMIN } from 'src/utils/constantes';

@Injectable()
export class AuthService {
  constructor(
    private readonly userservices: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  //-------------------------------------------------------------------------------------begin----
  async signInService(user: LogInDto) {
    try {
      switch (user.type) {
        case MEMBER:
          const loggeduser = await this.userservices.userByName(user.userName);
          if (!loggeduser) {
            return new NotFoundException('Invalid credential');
          } else {
            const isMatch = await bcrypt.compare(
              user.password,
              loggeduser.password,
            );
            if (isMatch) {
              const payload = {
                userName: user.userName,
                _id: loggeduser._id,
                role: loggeduser.role,
              };

              const token = this.jwt.sign(payload);
              const refresh_token = this.jwt.sign(payload, {
                secret: this.config.get('SECRET_REF'),
                expiresIn: '1y',
              });

              return {
                access_token: token,
                refresh_token: refresh_token,
              };
            } else return new UnauthorizedException('Invalid credential !');
          }

        case ADMIN:
          const loggedAdmin = await this.userservices.adminByuserName(
            user.userName,
          );
          if (!loggedAdmin) {
            return new NotFoundException('Invalid credential');
          } else {
            const isMatch = await bcrypt.compare(
              user.password,
              loggedAdmin.password,
            );
            if (isMatch) {
              const payload = {
                userName: user.userName,
                _id: loggedAdmin._id,
                role: loggedAdmin.privilege,
              };

              const token = this.jwt.sign(payload);
              const refresh_token = this.jwt.sign(payload, {
                secret: this.config.get('SECRET_REF'),
                expiresIn: '1y',
              });

              return {
                access_token: token,
                refresh_token: refresh_token,
              };
            } else return new UnauthorizedException('Invalid credential !');
          }
        default:
          return { message: 'type of user do not exist !' };
      }
    } catch (e) {
      return new BadRequestException(e);
    }
  }
}
