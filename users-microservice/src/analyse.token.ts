import { UsersService } from './app.users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { User } from './models/users.model';

@Injectable()
export class TokenAnalyse {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly userServices: UsersService,

    private readonly config: ConfigService,
  ) {}
  isValidToken(token: string) {
    try {
      const valid = this.jwtService.verify(token);
      return valid;
    } catch (e) {
      return e;
    }
  }
  async verifyRefToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: this.config.get<string>('SECRET_REF'),
    });
    console.log(decoded);
    let user = await this.userServices.userByName(decoded.userName);
    if (user) {
      return user;
    } else {
      throw new BadRequestException(
        'Unable to get the user from decoded token ',
      );
    }
  }
  async refreshToken(user: User): Promise<{ access_token: String }> {
    const payload = {
      userName: user.userName,
      _id: user._id,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return { access_token: token };
  }
}
