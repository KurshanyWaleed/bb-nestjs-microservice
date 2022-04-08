import { adminDto } from './../models/users.dto';
import { ServiceSender } from './../utils/service.sender';
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { User } from 'src/models/users.model';
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
} from './../utils/constantes';

@Injectable()
export class UsersService {
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
    return this.service.sendThisDataToMicroService(GET_USER_INFO, token, USERS);
  }

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
  refreshServices(token: string) {
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
  updatePassService(token: string, data: any) {
    data = {
      token,
      password: data,
    };
    return this.service.sendThisDataToMicroService(
      UPDATE_PASS_DATA,
      data,
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
  //!------------------------------*[here]*
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
}
