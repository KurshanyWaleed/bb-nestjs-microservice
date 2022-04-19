import { BASE_URL, BASE_URL_USERS, ESPACE } from './../utils/constantes';
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

@Controller('users')
export class UsersController {
  constructor(private readonly userServices: UsersService) {}
  @Post('sign-up')
  @UsePipes(ValidationPipe)
  createUser(@Body() data: inscriptionDto) {
    return this.userServices.createUser(data);
  }

  @Post('sign-in')
  @UsePipes(ValidationPipe)
  loginUsers(@Body() data: LogInDto) {
    return this.userServices.signInservice(data);
  }

  @Get('me')
  getUserInformation(@Req() req: Request) {
    return this.userServices.getUserInformationService(req);
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @UsePipes(new StatusPipe())
  @UsePipes(new BabyGenderPipe())
  updateUser(@Body() data: any, @Req() req: Request) {
    return this.userServices.updateUser(data, req);
  }

  @Get(':token/refresh')
  refresh(@Param('token') token: string) {
    return this.userServices.refreshServices(token);
  }

  @Post('/forgetPassword')
  @UsePipes(ValidationPipe)
  updatePasswordByEmail(@Body() inputEmail: ConfirmEmailToUpadatePasswordDto) {
    return this.userServices.changePassService(inputEmail);
  }
  //----------------------------------
  @Get('/welcome')
  @Render('thankpage')
  welcome(@Res() res: Response) {}
  @Get('/TU')
  @Render('thankpage')
  thanksPage(@Res() res: Response) {}
  //----------------------------------
  //todo  : -------Get permission BY EMAILSENDER-----------------------------*-
  @Get(':token/updating-Password-permission')
  @Redirect(`${BASE_URL_USERS}TU`)
  upadatePass(@Param('token') token: string) {
    return this.userServices.updateAttributeService(token, {
      ableToChangePassword: true,
    });
  }

  //todo : ---------Account confirmation BY EMAILSENDER----------------------*-
  @Get('confirm/:token')
  @Redirect(`${BASE_URL_USERS}welcome`)
  confirmation(@Param('token') token: string) {
    return this.userServices.profilVerified(token);
  }

  @Delete('this/deleting')
  deleteUser(@Req() req: Request) {
    return this.userServices.deleteAcountservice(req);
  }
  @Put('new-password')
  newPass(password: string, @Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    return this.userServices.updatePassService(token, password);
  }
  @Get('join/group/:title')
  joinGroup(@Param('title') groupTitle: string, @Req() req: Request) {
    const token = req.headers.authorization.split(ESPACE)[1];
    console.log(groupTitle);
    const requestPayload = { token: token, groupTitle: groupTitle };

    return this.userServices.joinGroup(requestPayload);
  }

  //------------------------------------ administartion ------
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
  //!------------------------------*[here]*
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
}
