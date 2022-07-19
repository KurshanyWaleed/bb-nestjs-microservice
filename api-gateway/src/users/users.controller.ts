import { ESPACE, local_BASE_URL_USERS } from './../utils/constantes';
import { BabyGenderPipe, StatusPipe } from 'src/pipes/customPipes';
import { JwtAuthGuard } from './guards/auth.guard';

import { adminDto, FeedbackDto, inscriptionDto } from 'src/models/users.dto';
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
  Query,
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
import { CreateActivityDTO } from 'src/models/users.model';
import { group } from 'console';

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

  @Post('feedback')
  onComplateActivityController(
    @Req() req: Request,
    @Body() feedback: FeedbackDto,
  ) {
    return this.userServices.onComplateActivityService(req, feedback);
  }
  @Get('feedbacks')
  getFeedbacksController(@Req() req: Request) {
    return this.userServices.getFeedbacksService(req);
  }
  @Get('feedbacks/me')
  getFeedbackbyIdController(@Req() req: Request) {
    return this.userServices.getFeedbackByIdService(req);
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
  @Get('join/group/:id')
  joinGroup(@Param('id') _id: string, @Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    console.log(_id);
    const requestPayload = { token: token, _id };
    return this.userServices.joinGroup(requestPayload);
  }

  @Post('edit-group/:id_group')
  editGroupController(
    @Param('id_group') group_id: string,
    @Req() req: Request,
    @Body() attributes: any,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.editGroupService(token, group_id, attributes);
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  @Get('get-group/:id_group')
  getOneGroupController(
    @Param('id_group') group_id: string,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.getOneGroupService(token, group_id);
    } catch (e) {
      return new UnauthorizedException();
    }
  }

  @Post('get-groups')
  getGroupsController(
    @Query('group-title') group_title: string,
    @Req() req: Request,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.getGroupsService(token, group_title);
    } catch (e) {
      return new UnauthorizedException();
    }
  }

  //todo ----------------------------------------------------- API Informations---------------------------------------------------
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
  //todo post postes
  @Post('create-post/:id_group')
  createNewPost(
    @Param('id_group') group: string,
    @Body()
    { content, media },
    @Req() req: Request,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];

      return this.userServices.createPostService({
        token,
        group,
        content,
        media,
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
  //todo -----------------------------------------------------------------------information API
  @Post('create-information')
  createNewInformationController(
    @Req() req: Request,
    @Body() { title, section, content, media },
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];

      return this.userServices.createNewInformationService(token, {
        title,
        section,
        content,
        media,
      });
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  //********** */

  @Delete('delete-information/:id')
  deleteInforamtionController(
    @Req() req: Request,
    @Param('id') id_information: string,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.deleteInforamtionService(token, id_information);
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  //*************** */

  //!------------------------------*[here]*  :D
  @Put('edit-information/:id')
  editeINforamtionController(
    @Req() req: Request,
    @Param('id') id_information: string,
    @Body() attributes: any,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];

      return this.userServices.editeINforamtionService(
        token,
        id_information,
        attributes,
      );
    } catch (e) {
      return new UnauthorizedException();
    }
  }
  //************** */

  @Get('get-informations')
  getInfomrationsController(
    @Req() req: Request,
    @Query('question') information: string,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];
      return this.userServices.getInfomrationsService(token, information);
    } catch (e) {
      return new UnauthorizedException();
    }
  }

  //**************** */

  @Get('get-information/:id')
  getOneInfromationByIdController(
    @Req() req: Request,
    @Param('id') id_information: string,
  ) {
    try {
      const token = req.headers.authorization.split(ESPACE)[1];

      return this.userServices.getOneInfromationByIdService(
        token,
        id_information,
      );
    } catch (e) {
      return new UnauthorizedException();
    }
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
  getQustions(@Req() req: Request, @Query('question') abc: string) {
    const token = req.headers.authorization.split(ESPACE)[1];
    try {
      return this.userServices.getAllQuestionsService(token, abc);
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
