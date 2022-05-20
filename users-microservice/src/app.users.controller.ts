import { CronService } from './cron.service';
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
  GET_MY_ACTIVITIES,
  NEW_ACTIVITY,
  UPDATE_ACTIVITY,
  NEW_QUESTION,
  UPDATE_QUESTION,
  GET_ALL_QUESTIONS,
  DELETE_QUESTION,
  GET_QUESTION_BY_ID,
  CREATE_INFORMATION,
  DELETE_INFORMATION,
  EDIT_INFORMATION,
  GET_INFORMATIONS,
  GET_ONE_INFORMATION,
} from './utils/constantes';
import {
  Controller,
  Inject,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { UsersService } from './app.users.service';
import {
  adminDto,
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
} from './models/users.dto';
import { User } from './models/users.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Activity, CreateActivityDTO } from './models/acitivites.model';

@Controller()
export class UsersController {
  user: User[] = [];
  constructor(
    private readonly userService: UsersService,
    private readonly cron: CronService, //  @Inject('ACTIVITIES') private readonly service: ClientProxy,
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
  //! Crone Job
  cronJob() {
    this.cron.dayCron();
  }
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

  //************************************************************************* */
  @MessagePattern(CONFIRM_ACCOUNT)
  async confirmAccount(token: string) {
    try {
      const hasBeenVerified = await this.userService.ProfilVerified(token);

      return hasBeenVerified
        ? { success: true }
        : { success: false, message: 'Invalid credentials' };
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }
  6;

  @MessagePattern(UPDATE_PASS_DATA)
  updatepasswordforgetten(data: { token: string; password: string }) {
    console.log(data);
    return this.userService.updateServices(data.token, data.password);
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
  @MessagePattern(GET_ME)
  getMe(token: string) {
    return this.userService.userByToken(token);
  }
  @MessagePattern(GET_MY_ACTIVITIES)
  getMyActivities(token: string) {
    return this.userService.activitiesByToken(token);
  }

  @MessagePattern(GET_USER_INFO)
  getUser(data: { _id: string; token: string }) {
    return this.userService.user_id(data._id, data.token);
  }
  //---------------------------------------admin

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
  @MessagePattern(NEW_ACTIVITY)
  async createActivity(payload: {
    token: string;
    newActivity: CreateActivityDTO;
  }) {
    console.log(payload);
    return this.userService.createActivitie(payload);
  }
  @MessagePattern(UPDATE_ACTIVITY)
  async updateActivitie(payload: {
    token: string;
    attributes: any;
    _id: string;
  }) {
    console.log(payload);
    return this.userService.updateActivitie(payload);
  }
  //todo --------------------------------------------information
  @MessagePattern(CREATE_INFORMATION)
  createNewInformationController({ token, title, section, content, media }) {
    return this.userService.createNewInformationService(token, {
      title,
      section,
      content,
      media,
    });
  }
  //********** */

  @MessagePattern(DELETE_INFORMATION)
  deleteInforamtionController({ token, id_information }) {
    return this.userService.deleteInforamtionService(token, id_information);
  }
  //*************** */

  @MessagePattern(EDIT_INFORMATION)
  editeINforamtionController({ token, id_information, attributes }) {
    return this.userService.editeInforamtionService(
      token,
      id_information,
      attributes,
    );
  }
  //************** */

  @MessagePattern(GET_INFORMATIONS)
  getInfomrationsController({ token, information }) {
    return this.userService.getInfomrationsService(token, information);
  }
  //**************** */

  @MessagePattern(GET_ONE_INFORMATION)
  getOneInfromationByIdController({ token, id_information }) {
    return this.userService.getOneInfromationByIdService(token, id_information);
  }
  //?----------------------------------------FAQ

  @MessagePattern(NEW_QUESTION)
  createNewQuestion(payload: {
    token: string;
    newQuestion: { content: string; requested: boolean; answer: string };
  }) {
    return this.userService.createNewQuestionService(payload);
  }
  // // todo answer qusetion
  // @MessagePattern(ANSWER_QUESTION)
  // answerQuestion(payload: {
  //   token: string;
  //   id_question: string;
  //   answer: string;
  // }) {
  //   return this.userService.answerQuestionService(payload);
  // }
  //!------------------------------------------[here]
  @MessagePattern(UPDATE_QUESTION)
  updateQuestion(payload: {
    token: string;
    id_question: string;
    attributes: string;
  }) {
    return this.userService.updateQuestionService(payload);
  }

  @MessagePattern(GET_ALL_QUESTIONS)
  getAllQuestions({ token, abc }) {
    return this.userService.getAllQuestionsService({
      token,
      abc,
    });
  }

  //todo get question By ID
  @MessagePattern(GET_QUESTION_BY_ID)
  getQuestionByIdService(payload: { token: string; id_question: string }) {
    return this.userService.getQuestionByIdService(payload);
  }

  @MessagePattern(DELETE_QUESTION)
  deleteQuestion({ token, id_question }) {
    return this.userService.deleteQuestion(token, id_question);
  }

  //********************************************************************* */
  // @Cron(CronExpression.EVERY_WEEK)
  // async activitiesOfWeek() {
  //   return await this.userService.activitiesOfWeekService();
  // }
}
