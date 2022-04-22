import { TokenAnalyse } from './analyse.token';
import { privilege } from './utils/enum';
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
  NEW_GROUP,
  REQUEST_TO_JOIN_GROUP,
  GET_PERMISSION,
  GET_USER_INFO,
  GET_ME,
  ACTIVITIES_OF_WEEK,
} from './utils/constantes';
import { Controller, Inject, UnauthorizedException } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { UsersService } from './app.users.service';
import {
  adminDto,
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
} from './models/users.dto';
import { User, Token } from './models/users.model';
import { Cron, CronExpression } from '@nestjs/schedule';

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
  async refreshToken(token: string) {
    return await this.userService.refreshTokenService(token);
  }

  //todo :refresh permission
  @MessagePattern(GET_PERMISSION)
  async refreshPermission(token: string) {
    console.log(await this.userService.refreshPermissionService(token));
    return await this.userService.refreshPermissionService(token);
  }
  //todo :update password
  @MessagePattern(UPDATE_PASS)
  async updatepass(email: ConfirmEmailToUpadatePasswordDto) {
    return await this.userService.changePassService(email);
  }
  //todo : update password permission action : email
  @MessagePattern(UPERMESSION)
  getPermission(token: string) {
    return this.userService.getPermissionService(token);
  }
  //!-----------------------------------------------
  // todo : sending activities of the week
  //@MessagePattern(ACTIVITIES_OF_WEEK)
  @Cron(CronExpression.EVERY_5_MINUTES)
  async activitiesOfWeek(payload: any) {
    return await this.userService.activitiesOfWeekService(payload);
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
  @MessagePattern(GET_ME)
  getMe(token: string) {
    return this.userService.userByToken(token);
  }
  @MessagePattern(GET_USER_INFO)
  getUser(data: { _id: string; token: string }) {
    return this.userService.user_id(data._id, data.token);
  }
  @MessagePattern(NEW_GROUP)
  async privilegeAlayzer(data: { token: string; clientInformation: any }) {
    return this.userService.creategroup(data.token, data.clientInformation);
  }
  @MessagePattern(REQUEST_TO_JOIN_GROUP)
  async joinGroupRequest(payload: { token: string; groupTitle: string }) {
    console.log('huser controller : ' + payload.groupTitle);
    return this.userService.joinRequestService({
      token: payload.token,
      groupTitle: payload.groupTitle,
    });
  }
}
