import { ServiceSender } from './service.sender';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { adminDto, FeedbackDto } from './../models/users.dto';
import { map, Observable } from 'rxjs';
import { Activity, CreateActivityDTO, User } from 'src/models/users.model';
import { Request } from 'express';
import {
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
  LogInDto,
} from 'src/models/users.dto';
import {
  REFRESH_TOKEN,
  GET_BY_NAME,
  TESTING,
  DELETING,
  UPDATING,
  LOGIN,
  GET_USER_INFO,
  INSCRIPTION,
  UPDATE_PASS,
  CONFIRM_ACCOUNT,
  ESPACE,
  UPERMESSION,
  UPDATE_PASS_DATA,
  USERS,
  INSCRI_ADMIN,
  GET_ALL_USERS,
  GET_USER,
  NEW_GROUP,
  REQUEST_TO_JOIN_GROUP,
  GET_PERMISSION,
  GET_ME,
  GET_MY_ACTIVITIES,
  NEW_ACTIVITY,
  UPDATE_ACTIVITY,
  NEW_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  GET_ALL_QUESTIONS,
  GET_QUESTION_BY_ID,
  ANSWER_QUESTION,
  CREATE_INFORMATION,
  DELETE_INFORMATION,
  EDIT_INFORMATION,
  GET_ONE_INFORMATION,
  GET_INFORMATIONS,
  CREATE_POST,
  GET_GROUPS,
  GET_ONE_GROUP,
  EDIT_GROUP,
  POST_FEEDBACK,
  GET_FEEDBACK,
  GET_FEEDBACK_BY_ID,
} from './../utils/constantes';

@Injectable()
export class UsersService {
  public access: boolean = false;
  constructor(private readonly service: ServiceSender) {}
  GetInfoFromMS() {
    let users = [User];
    return this.service.sendThisDataToMicroService(TESTING, {}, USERS).pipe(
      map((data) => {
        users = data;
        return users;
      }),
    );
  }

  async joinGroup(payload: { token: string; _id: string }) {
    return this.service.sendThisDataToMicroService(
      REQUEST_TO_JOIN_GROUP,
      payload,
      USERS,
    );
  }
  async createAdmin(user: adminDto) {
    return this.service
      .sendThisDataToMicroService(INSCRI_ADMIN, user, USERS)
      .pipe(
        map((data) => {
          if (data._id != undefined) {
            return { new_user_id: data._id };
          } else {
            return data;
          }
        }),
      );
  }
  async createUser(user: inscriptionDto) {
    return this.service
      .sendThisDataToMicroService(INSCRIPTION, user, USERS)
      .pipe(
        map((data) => {
          if (data._id != undefined) {
            return { new_user_id: data._id };
          } else {
            return data;
          }
        }),
      );
  }
  async getUserInformationService(req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    console.log(token);
    return this.service.sendThisDataToMicroService(GET_ME, token, USERS);
  }

  async getUserActivitiesService(req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    console.log(token);
    return this.service.sendThisDataToMicroService(
      GET_MY_ACTIVITIES,
      token,
      USERS,
    );
  }
  //todo----------------------

  onComplateActivityService(req: Request, feedback: FeedbackDto) {
    const token = req.headers.authorization.split(ESPACE)[1];
    console.log(token);
    return this.service.sendThisDataToMicroService(
      POST_FEEDBACK,
      { token, feedback },
      USERS,
    );
  }
  getFeedbacksService(req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return this.service.sendThisDataToMicroService(GET_FEEDBACK, token, USERS);
  }
  getFeedbackByIdService(req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return this.service.sendThisDataToMicroService(
      GET_FEEDBACK_BY_ID,
      token,
      USERS,
    );
  }
  //

  signInservice(data: LogInDto) {
    console.log(data);
    return this.service.sendThisDataToMicroService(LOGIN, data, USERS);
  }

  updateUser(data: any, req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];

    return this.service.sendThisDataToMicroService(
      UPDATING,
      { data, token },
      USERS,
    );
  }
  deleteAcountservice(req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return this.service.sendThisDataToMicroService(DELETING, token, USERS);
  }

  getUserByUserNameService(userName: string): Observable<User> {
    return this.service
      .sendThisDataToMicroService(GET_BY_NAME, userName, USERS)
      .pipe(
        map((data) => {
          const user = data;
          return user;
        }),
      );
  }
  refreshPermission(token: string) {
    return this.service.sendThisDataToMicroService(
      GET_PERMISSION,
      token,
      USERS,
    );
  }
  //!-----------------------------------
  refreshTokenServices(token: string) {
    return this.service.sendThisDataToMicroService(REFRESH_TOKEN, token, USERS);
  }
  changePassService(inputEmail: ConfirmEmailToUpadatePasswordDto) {
    return this.service.sendThisDataToMicroService(
      UPDATE_PASS,
      inputEmail,
      USERS,
    );
  }
  updateAttributeService(token: string, data: any) {
    return this.service.sendThisDataToMicroService(UPERMESSION, token, USERS);
  }
  updatePassService(token: string, password: any) {
    const payload = {
      token,
      password,
    };
    console.log(password);
    return this.service.sendThisDataToMicroService(
      UPDATE_PASS_DATA,
      payload,
      USERS,
    );
  }
  profilVerified(token: string) {
    return this.service.sendThisDataToMicroService(
      CONFIRM_ACCOUNT,
      token,
      USERS,
    );
  }
  async getAllUsers(token: string) {
    return this.service.sendThisDataToMicroService(GET_ALL_USERS, token, USERS);
  }

  async getUserById(_id: string, token: string) {
    return this.service.sendThisDataToMicroService(
      GET_USER,
      { _id, token },
      USERS,
    );
  }
  //todo ----------------------------------Group
  async creategroup(data: { token: string; clientInformation: any }) {
    return this.service.sendThisDataToMicroService(NEW_GROUP, data, USERS);
  }
  createActivites(payload: { token: string; newActivity: CreateActivityDTO }) {
    console.log(payload);
    return this.service.sendThisDataToMicroService(
      NEW_ACTIVITY,
      payload,
      USERS,
    );
  }
  getGroupsService(token: string, groupTitle?: string) {
    return this.service.sendThisDataToMicroService(
      GET_GROUPS,
      { token, groupTitle },
      USERS,
    );
  }

  getOneGroupService(token: string, group_id: string) {
    return this.service.sendThisDataToMicroService(
      GET_ONE_GROUP,
      { token, group_id },
      USERS,
    );
  }

  editGroupService(token: string, group_id: string, attributes: string) {
    return this.service.sendThisDataToMicroService(
      EDIT_GROUP,
      { token, group_id, attributes },
      USERS,
    );
  }

  createPostService({ token, group, content, media }) {
    return this.service.sendThisDataToMicroService(
      CREATE_POST,
      { token, group, content, media },
      USERS,
    );
  }
  //------------------------------
  updateActivity(payload: { token: string; attributes: any; _id: string }) {
    return this.service.sendThisDataToMicroService(
      UPDATE_ACTIVITY,
      payload,
      USERS,
    );
  }
  //todo ------------------------------------information
  createNewInformationService(
    token: string,
    { title, section, content, media },
  ) {
    return this.service.sendThisDataToMicroService(
      CREATE_INFORMATION,
      { token, title, section, content, media },
      USERS,
    );
  }
  //!------------------------------*[here]*  :D
  deleteInforamtionService(token: string, id_information: string) {
    return this.service.sendThisDataToMicroService(
      DELETE_INFORMATION,
      { token, id_information },
      USERS,
    );
  }
  editeINforamtionService(
    token: string,
    id_information: string,
    attributes: any,
  ) {
    return this.service.sendThisDataToMicroService(
      EDIT_INFORMATION,
      { token, id_information, attributes },
      USERS,
    );
  }
  getOneInfromationByIdService(token: string, id_information: string) {
    return this.service.sendThisDataToMicroService(
      GET_ONE_INFORMATION,
      { token, id_information },
      USERS,
    );
  }
  getInfomrationsService(token: string, information: string) {
    return this.service.sendThisDataToMicroService(
      GET_INFORMATIONS,
      { token, information },
      USERS,
    );
  }
  //?-------------------------------------FAQ
  //add question
  createQustionService(payload: {
    token: string;
    newQuestion: { content: string; requested: boolean; answer: string };
  }) {
    return this.service.sendThisDataToMicroService(
      NEW_QUESTION,
      payload,
      USERS,
    );
  }
  //get all questions

  getAllQuestionsService(token: string, abc: string) {
    return this.service.sendThisDataToMicroService(
      GET_ALL_QUESTIONS,
      { token, abc },
      USERS,
    );
  }
  //add questions by id
  getQustionbyIdService(payload: { token: string; id_question: string }) {
    return this.service.sendThisDataToMicroService(
      GET_QUESTION_BY_ID,
      payload,
      USERS,
    );
  }
  // update question by administration
  updateQustionbyIdService(payload: {
    token: string;
    id_question: string;
    attributes: string;
  }) {
    return this.service.sendThisDataToMicroService(
      UPDATE_QUESTION,
      payload,
      USERS,
    );
  }

  // delete question by administration
  deleteQustionbyIdService(payload: { token: string; id_question: string }) {
    return this.service.sendThisDataToMicroService(
      DELETE_QUESTION,
      payload,
      USERS,
    );
  }
  // answerQustionbyIdService(data: {
  //   token: string;
  //   id_question: string;
  //   answer: string;
  // }) {
  //   return this.service.sendThisDataToMicroService(
  //     ANSWER_QUESTION,
  //     data,
  //     USERS,
  //   );
  // }
}
