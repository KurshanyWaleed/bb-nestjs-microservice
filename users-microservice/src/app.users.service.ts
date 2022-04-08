import { Administration } from './models/users.model';
import { Activity, UsersActivities } from './models/acitivites.model';
import { GET_USER_ACITIVITES } from './utils/constantes';
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
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserToken } from 'src/models/users.model';

import {
  adminDto,
  ConfirmEmailToUpadatePasswordDto,
  inscriptionDto,
} from './models/users.dto';
import { TokenAnalyse } from './analyse.token';
import { ServiceSender } from './activities.m.service';

@Injectable()
export class UsersService {
  userActivities: Activity[] = [];
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
  async getUserservice(token: string) {
    await this.tokenAnalyser.isValidToken(token);
    const user = this.jwt.decode(token);
    const usr = user as UserToken;
    return await this.userModel.findById({ _id: usr._id });
  }
  //--------------------------------------1---------
  async createUser(data: inscriptionDto) {
    try {
      if (!this.service.isConnected) {
        return new BadGatewayException(
          'The remote server is not in service 🦕 ',
        );
      } else {
        this.service
          .sendThisDataToMicroService(GET_USER_ACITIVITES, {
            situation: data.situation,
            babyAge: data.babyAge,
          })
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

  async getUsers() {
    return await this.userModel.find();
  }

  async userByName(userName: string) {
    return await this.userModel.findOne({ userName });
  }
  async adminByuserName(userName: string) {
    return await this.adminModel.findOne({ userName });
  }
  async deleteService(token: any) {
    try {
      await this.jwt.verify(token);
      const userdata = this.jwt.decode(token);
      const currentUsr = userdata as UserToken;
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
      const usr = userdata as UserToken;
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
      throw new NotFoundException(
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
  //!------------------------------------------[here]
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
}
