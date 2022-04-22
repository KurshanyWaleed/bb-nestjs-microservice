import { Length } from 'class-validator';
import { GroupDto } from './models/group.dto';
import { BabyGender } from 'src/utils/enum';
import { Administration, Token } from './models/users.model';
import { Activity, UsersActivities } from './models/acitivites.model';
import {
  GET_USER_ACITIVITES,
  ADMIN,
  NEW_GROUP,
  FORUM,
  ACTIVITIES,
  REQUEST_TO_JOIN_GROUP,
  MEMBER,
  ESPACE,
  GET_ACTIVITIES_OF_WEEK,
} from './utils/constantes';
import { EmailService } from './user.mail.config.services';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/models/users.model';

import {
  adminDto,
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
} from './models/users.dto';
import { TokenAnalyse } from './analyse.token';

import { privilege } from './utils/enum';
import { ServiceSender } from './service.sender';

@Injectable()
export class UsersService {
  userActivities: Activity[] = [];
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectModel(Administration.name)
    private readonly adminModel: Model<Administration>,
    private readonly config: ConfigService,
    private readonly tokenAnalyser: TokenAnalyse,
    private readonly jwt: JwtService,
    private readonly emailService: EmailService,
    private readonly service: ServiceSender,
  ) {}

  //--------------------------------------begin---------
  async activitiesOfWeekService(payload: any) {
    this.logger.verbose('----------------------------------------');
    const users = await this.userModel.find();
    users.forEach((user) => {
      this.service
        .sendThisDataToMicroService(
          GET_ACTIVITIES_OF_WEEK,

          {
            last_week_activities:
              user.usersActivities[user.usersActivities.length - 1].title.split(
                ESPACE,
              )[1],
            user_situation: user.situation,
          },
          // { message: 'user activities is empty ' },
          ACTIVITIES,
        )
        .subscribe(async (data) => {
          this.logger.debug(data.map((activities) => activities.title));
          await this.userModel.updateOne(
            { _id: user._id },
            {
              $push: {
                usersActivities: data,
              },
            },
          );
          // // return currentUser;
        });
    });
  }

  async getUserservice(token: string) {
    await this.tokenAnalyser.isValidToken(token);
    const user = this.jwt.decode(token);
    const usr = user as Token;
    return await this.userModel.findById({ _id: usr._id });
  }
  //--------------------------------------1---------
  async createUser(data: inscriptionDto) {
    try {
      if (!this.service.activitiesIsConnected) {
        return new BadGatewayException(
          'The remote server is not in service 🦕 ',
        );
      } else {
        this.service
          .sendThisDataToMicroService(
            GET_USER_ACITIVITES,
            {
              situation: data.situation,
              babyAge: data.babyAge,
            },
            ACTIVITIES,
          )
          .subscribe((newdata) => (this.userActivities = newdata));

        const newUser = await (
          await this.userModel.create({
            ...data,
            situation: data.situation,
            babyAge: data.babyAge,
            password: await bcrypt.hash(
              data.password,
              parseInt(this.config.get<string>('SALT_OR_ROUNDS')),
            ),
            usersActivities: this.userActivities,
          })
        ).save();
        const token = this.jwt.sign(
          { username: newUser.userName },
          { secret: this.config.get('SECRET') },
        );
        await this.emailService.sendEmail(newUser.email, token);

        return newUser;
      }
    } catch (e) {
      return new ConflictException(e);
    }
  }

  async getUsers(token: string) {
    const checkedToken = await this.jwt.verify(token);
    if (checkedToken) {
      const admin = this.jwt.decode(token);
      const currentAdmin = admin as Token;
      if (
        currentAdmin.role == privilege.ADMIN ||
        currentAdmin.role == privilege.DATA_ANALYSER
      ) {
        return await this.userModel.find();
      } else {
        return new UnauthorizedException();
      }
    }
  }

  async adminByuserName(userName: string) {
    return await this.adminModel.findOne({ userName });
  }

  async userByToken(token: string) {
    try {
      this.tokenAnalyser.isValidToken(token);
      const currentUser = this.jwt.decode(token) as Token;
      const { userName, location, situation, babyAge, babyGender } =
        await this.userModel.findOne({ _id: currentUser._id });
      return {
        userName,
        location,
        situation,
        babyAge,
        babyGender,
      };
    } catch (e) {
      return {
        error: e,
      };
    }
  }

  async userByName(userName: string) {
    return await this.userModel.findOne({ userName });
  }
  async user_id(_id: string, token: string) {
    try {
      const checkedToken = await this.jwt.verify(token);
      console.log(checkedToken);

      const tokendetails = this.jwt.decode(token);
      const currentUser = tokendetails as Token;
      if (
        currentUser.role == privilege.ADMIN ||
        currentUser.role == privilege.DATA_ANALYSER ||
        (currentUser.role == privilege.MEMEBER &&
          (await this.userModel.findOne({ _id }))._id == _id)
      ) {
        return await this.userModel.findOne({ _id });
      } else {
        return new UnauthorizedException();
      }
    } catch (e) {
      return new BadRequestException(e);
    }
  }
  async deleteService(token: any) {
    try {
      await this.jwt.verify(token);
      const userdata = this.jwt.decode(token);
      const currentUsr = userdata as Token;
      const data = await this.userModel.findOne({ _id: currentUsr._id });
      if (data._id == currentUsr._id) {
        await this.userModel.deleteOne({ _id: currentUsr._id });
        return { message: 'Account has been deleted succesfully ' };
      } else {
        return { message: 'Sorry you dont have permission' };
      }
    } catch (e) {
      return new BadRequestException({
        error: { message: 'something went wrong' },
      });
    }
  }
  async updateServices(token: string, attributes: any) {
    console.log(attributes);
    try {
      await this.jwt.verify(token);
      const userdata = this.jwt.decode(token);
      const usr = userdata as Token;
      if (!(attributes.password == undefined)) {
        // if password existe :
        try {
          const user = await this.userModel.findById({ _id: usr._id });
          if (user.ableToChangePassword == true) {
            await this.userModel.findOneAndUpdate(
              { _id: usr._id },
              {
                ...attributes,
                password: await bcrypt.hash(
                  attributes.password,
                  parseInt(this.config.get<string>('SALT_OR_ROUNDS')),
                ),
              },
            );
            return { success: true };
          } else {
            return {
              message: 'Permission Denied ',
            };
          }
        } catch (e) {
          return new ConflictException(
            `${Object.keys(e.keyValue)} is already exist !`,
          );
        }
      } else {
        console.log('here is it ');
        console.log(attributes);
        console.log(usr);
        await this.userModel.findOneAndUpdate({ _id: usr._id }, attributes);
        return { success: true };
      }
    } catch (e) {
      return new BadRequestException(e);
    }
  }
  //todo :refresh token
  async refreshTokenService(token: string) {
    if (await this.tokenAnalyser.isValidToken(token)) {
      const user = await this.tokenAnalyser.verifyRefToken(token);
      if (user) {
        return this.tokenAnalyser.refreshToken(user);
      } else {
        return { message: 'Invalid token !' };
      }
    } else {
      return { message: 'Invalid token !' };
    }
  }
  //!------------------------------------------[here]5
  //todo :refresh permission
  async refreshPermissionService(token: string) {
    console.log(token);
    const user = this.jwt.decode(token) as Token;
    const persistenceUser = await this.userModel.findOne({ _id: user._id });
    if (persistenceUser.ableToChangePassword == true) {
      return {
        permission: true,
      };
    } else
      return {
        permission: false,
      };
  }

  async changePassService(inputEmail: ConfirmEmailToUpadatePasswordDto) {
    const user = await this.userModel.findOne({ email: inputEmail.email });
    if (user) {
      const token = this.jwt.sign(
        { username: user.userName, _id: user._id },
        { secret: this.config.get('SECRET') },
      );
      await this.emailService.sendEmailForPasswordForgetten(
        inputEmail.email,
        token,
      );
      return { permissionToken: token };
    } else {
      return new NotFoundException(
        `This Email ${inputEmail.email} does not exist ! `,
      );
    }
  }
  getPermissionService(token: string) {
    return this.updateServices(token, { ableToChangePassword: true });
  }
  async ProfilVerified(token: string) {
    const decoded = await this.jwt.verify(token);
    if (decoded) {
      return await this.userModel.findOneAndUpdate(
        { userName: decoded.username },
        { verified: true },
      );
    } else {
      return new UnauthorizedException();
    }
  }
  //todo:------------------------------------------- administration -----------------------------------
  async createAdmin(newAdmin: adminDto) {
    const newUser = await (
      await this.adminModel.create({
        ...newAdmin,
        password: await bcrypt.hash(
          newAdmin.password,
          parseInt(this.config.get<string>('SALT_OR_ROUNDS')),
        ),
        usersActivities: this.userActivities,
      })
    ).save();
    return { new_admin: newUser._id };
  }
  async onUserAnalyse(token: string) {
    try {
      console.log(token);
      this.tokenAnalyser.isValidToken(token);
      const decoded = this.jwt.decode(token);

      const isAdmin = decoded as Token;
      return isAdmin.role;
    } catch (e) {
      return 'error';
    }
  }
  async creategroup(token: string, newGroup: GroupDto) {
    const previlege = await this.onUserAnalyse(token);
    if (previlege == ADMIN) {
      return this.service.sendThisDataToMicroService(
        NEW_GROUP,
        newGroup,
        FORUM,
      );
    } else {
      return { message: 'access_denied' };
    }
  }
  async joinRequestService(payload: { token: string; groupTitle: string }) {
    const previlege = await this.onUserAnalyse(payload.token);
    const decoded = this.jwt.decode(payload.token);
    const user = decoded as Token;
    const requestPayload = { _id: user._id, groupTitle: payload.groupTitle };
    if (previlege == MEMBER) {
      return this.service.sendThisDataToMicroService(
        REQUEST_TO_JOIN_GROUP,
        requestPayload,
        FORUM,
      );
    } else {
      return { message: 'Please try to sign-in first then try again ' };
    }
  }
}
