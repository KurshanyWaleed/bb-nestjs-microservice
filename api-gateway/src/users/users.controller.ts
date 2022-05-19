import { ESPACE, local_BASE_URL_USERS } from './../utils/constantes';
import { BabyGenderPipe, StatusPipe } from 'src/pipes/customPipes';
import { JwtAuthGuard } from './guards/auth.guard';

import { adminDto, inscriptionDto } from 'src/models/users.dto';
import { UsersService } from './users.service';
import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Redirect,
  Render,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConfirmEmailToUpadatePasswordDto,
  LogInDto,
} from './../models/users.dto';
import { GroupDto } from 'src/models/group.dto';
import { Activity, CreateActivityDTO } from 'src/models/users.model';

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}
  //todo  : ------Sign Up-----------------------------*->
  @Post('sign-up')
  @UsePipes(ValidationPipe)
  createUser(@Body() data: inscriptionDto) {
    return this.userServices.createUser(data);
  }
  //todo  : ------Sign In-----------------------------*->
  @Post('sign-in')
  @UsePipes(ValidationPipe)
  loginUsers(@Body() data: LogInDto) {
    return this.userServices.signInservice(data);
  }
  //todo  : ------Get User Info-----------------------------*->
  @Get('me')
  getUserInformation(@Req() req: Request) {
    return this.userServices.getUserInformationService(req);
  }
  @Get('list-activities')
  getUserActivities(@Req() req: Request) {
    return this.userServices.getUserActivitiesService(req);
  }
  //todo  : ------Update User Infos-----------------------------*->
  @Put('update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UsePipes(new StatusPipe())
  @UsePipes(new BabyGenderPipe())
  updateUser(@Body() data: any, @Req() req: Request) {
    return this.userServices.updateUser(data, req);
  }
  //todo  : ------Get Permission To Upadte Password -----------------------------*->
  @Get(':token/refresh')
  refresh(@Param('token') token: string) {
    console.log(token);
    return this.userServices.refreshPermission(token);
  }
  //todo  : ------Refresh Token-----------------------------*->
  @Get('refresh-token')
  refreshToekn(@Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return this.userServices.refreshTokenServices(token);
  }
  //todo  : ------Forget Password-----------------------------*->
  @Post('/forgetPassword')
  @UsePipes(ValidationPipe)
  updatePasswordByEmail(@Body() inputEmail: ConfirmEmailToUpadatePasswordDto) {
    return this.userServices.changePassService(inputEmail);
  }
  //todo  : ------Enter new Password-----------------------------*->

  @Put('new-password')
  newPass(@Body() password: string, @Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return this.userServices.updatePassService(token, password);
  }
  //todo  : ------Rendring ThankYou Page-----------------------------*->
  @Get('/welcome')
  @Render('thankpage')
  welcome(@Res() res: Response) {}
  @Get('/TU')
  @Render('thankpage')
  thanksPage(@Res() res: Response) {}
  //----------------------------------
  //todo  : -------Get permission BY EMAILSENDER-----------------------------*-
  @Get(':token/updating-Password-permission')
  @Redirect(`${local_BASE_URL_USERS}TU`)
  upadatePass(@Param('token') token: string) {
    return this.userServices.updateAttributeService(token, {
      ableToChangePassword: true,
    });
  }

  //todo : ---------Account confirmation BY EMAILSENDER----------------------*-
  @Get('confirm/:token')
  @Redirect(`${local_BASE_URL_USERS}welcome`)
  confirmation(@Param('token') token: string) {
    return this.userServices.profilVerified(token);
  }

  //todo  : ------deleting User account-----------------------------*->
  @Delete('this/deleting')
  deleteUser(@Req() req: Request) {
    return this.userServices.deleteAcountservice(req);
  }

  //?  : ----Group : Join Group-----------------------------*->
  @Get('join/group/:title')
  joinGroup(@Param('title') groupTitle: string, @Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    console.log(groupTitle);
    const requestPayload = { token: token, groupTitle: groupTitle };
    return this.userServices.joinGroup(requestPayload);
  }

  //------------------------------------ administartion ------<<<>>>
  @Post('admin/sign-up')
  @UsePipes(ValidationPipe)
  async createAdmin(
    @Body()
    newAdmin: adminDto,
  ) {
    return await this.userServices.createAdmin(newAdmin);
  }
  @Get('admin/all-users')
  async getallUsers(@Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return await this.userServices.getAllUsers(token);
  }

  @Get('admin/this/user/:id')
  async getuser(@Param('id') _id: string, @Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return await this.userServices.getUserById(_id, token);
  }
  @Post('admin/add-new-group')
  createGroup(@Body() clientInformation: GroupDto, @Req() req: Request) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.creategroup({
        token,
        clientInformation,
      });
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  //! creation of activities :
  @Post('admin/create-activities')
  async createActivities(
    @Body() newActivity: CreateActivityDTO,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(ESPACE)[1];
    const payload = { token, newActivity };
    return this.userServices.createActivites(payload);
  }

  @Post('admin/update-activity/:id')
  async updateActivities(
    @Param('id') _id,
    @Body() attributes: any,
    @Req() req: Request,
  ) {
    const token = req.headers.authorization.split(ESPACE)[1];
    const payload = { token, attributes, _id };

    return this.userServices.updateActivity(payload);
  }
  //?-----------------------------------------------------------FAQ
  //! add qustion

  @Post('/add-new-question')
  createQustion(
    @Body()
    newQuestion: { content: string; requested: boolean; answer: string },
    @Req() req: Request,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.createQustionService({
        token,
        newQuestion,
      });
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  //! get questions

  @Get('get-questions')
  getQustions(@Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    try {
      return this.userServices.getAllQuestionsService(token);
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  //! get qustion by id

  @Get('get-question/:id')
  getQustionbyId(@Param('id') id_question: string, @Req() req: Request) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];

      return this.userServices.getQustionbyIdService({
        token,
        id_question,
      });
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  //todo  update question administration

  @Post('/update-qustions/:id')
  updateQustionbyId(
    @Body() attributes: string,
    @Param('id') id_question: string,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.updateQustionbyIdService({
        token,
        id_question,
        attributes,
      });
    } catch (e) {
      return new UnauthorizedException(e);
    }
  }
  //todo delete question administration

  @Delete('/delete-qustion/:id')
  deleteQustionbyId(@Param('id') id_question: string, @Req() req: Request) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.deleteQustionbyIdService({
        token,
        id_question,
      });
    } catch (e) {
      return new UnauthorizedException('access denied');
    }
  }
  // //todo  add answer to question
  // @UseGuards(JwtAuthGuard)
  // @Post('/answer-qustions/:id')
  // answerQustionbyId(
  //   @Body() answer: string,
  //   @Param('id') id_question: string,
  //   @Req() req: Request,
  // ) {
  //   const token = req.headers.authorization.split(ESPACE)[1];
  //   return this.userServices.answerQustionbyIdService({
  //     token,
  //     id_question,
  //     answer,
  //   });
  // }
}
