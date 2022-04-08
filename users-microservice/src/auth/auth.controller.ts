import { AuthService } from './auth.service';
import { LogInDto } from './../models/users.dto';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LOGIN } from 'src/utils/constantes';

@Controller()
export class AuthController {
  constructor(private readonly authservices: AuthService) {}

  //login
  @MessagePattern(LOGIN)
  async signIn(user: LogInDto) {
    console.log(user);
    return await this.authservices.signInService(user);
  }
}
