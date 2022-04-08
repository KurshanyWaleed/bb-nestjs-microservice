import {
  UPDATING,
  INSCRIPTION,
  GET_BY_NAME,
  DELETING,
  REFRESH_TOKEN,
  UPDATE_PASS,
  UPERMESSION,
  CONFIRM_ACCOUNT,
  UPDATE_PASS_DATA,
  INSCRI_ADMIN,
  GET_ALL_USERS,
  GET_USER,
} from './utils/constantes';
import { Controller, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { UsersService } from './app.users.service';
import {
  adminDto,
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
} from './models/users.dto';
import { User } from './models/users.model';

@Controller()
export class UsersController {
  user: User[] = [];
  constructor(
    private readonly userService: UsersService, //  @Inject('ACTIVITIES') private readonly service: ClientProxy,
  ) {}
  // todo signUp Account http
  // @Post()
  // createUser(@Body() data: inscriptionDto) {
  //   return this.userService.createUser(data);
  // }
  // todo get Account data by token
  // @MessagePattern(TESTING)
  // getUserByToken(req: any) {
  //   console.log(req);
  //   return this.userService.getUserservice(req);
  // }
  // todo signUp Account
  @MessagePattern(INSCRIPTION)
  async signUp(newUser: inscriptionDto) {
    const isAdded = await this.userService.createUser(newUser);
    return isAdded;
  }

  // todo get Account by userName
  @MessagePattern(GET_BY_NAME)
  async getUserByName(userName: string) {
    const isAdded = await this.userService.userByName(userName);
    return isAdded;
  }
  // todo : update Acocunt
  @MessagePattern(UPDATING)
  update(data: any) {
    return this.userService.updateServices(data.token, data.attributes);
  }
  // todo : delete Account
  @MessagePattern(DELETING)
  delete(data: any) {
    return this.userService.deleteService(data);
  }
  //todo :refresh token
  @MessagePattern(REFRESH_TOKEN)
  refreshToken(token: string) {
    return this.userService.refreshTokenService(token);
  }
  //todo :update password
  @MessagePattern(UPDATE_PASS)
  updatepass(email: ConfirmEmailToUpadatePasswordDto) {
    return this.userService.changePassService(email);
  }
  //todo : update password permission
  @MessagePattern(UPERMESSION)
  getPermission(token: string) {
    return this.userService.getPermissionService(token);
  }
  @MessagePattern(CONFIRM_ACCOUNT)
  async confirmAccount(token: string) {
    try {
      const hasBeenVerified = await this.userService.ProfilVerified(token);
      console.log(hasBeenVerified);
      return hasBeenVerified
        ? { success: true }
        : { success: false, message: 'Invalid credentials' };
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
  @MessagePattern(UPDATE_PASS_DATA)
  updatepasswordforgetten(data: { token: string; password: string }) {
    return this.userService.updateServices(data.token, {
      password: data.password,
    });
  }

  // todo signUp admin Account

  @MessagePattern(INSCRI_ADMIN)
  async signUpAdmin(newUser: adminDto) {
    const isAdded = await this.userService.createAdmin(newUser);
    return isAdded;
  }

  @MessagePattern(GET_ALL_USERS)
  getallUsers(token: string) {
    return this.userService.getUsers(token);
  }
  //!------------------------------------------[here]
  @MessagePattern(GET_USER)
  getUser(data: { _id: string; token: string }) {
    return this.userService.user_id(data._id, data.token);
  }
}
