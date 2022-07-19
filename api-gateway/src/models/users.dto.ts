import { level, rating } from './../utils/enum';
import { IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { babyGender, privilege, situation, userType } from 'src/utils/enum';

export class adminDto {
  @IsNotEmpty()
  identifier: string;
  @IsNotEmpty()
  @Length(6)
  password: string;
  @IsNotEmpty()
  privilege: privilege;
}

export class FeedbackDto {
  id_week: string;
  id_activity: string;
  id_user: string;
  reactions: string;
  level: level;
  rating: rating;
}
export class UserToken {
  userName: string;
  _id: string;
  iat: string;
  exp: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  token: string;
}

export class LogInDto {
  @IsNotEmpty()
  userName: string;
  @IsNotEmpty()
  @Length(6)
  password: string;
  @IsNotEmpty()
  type: string;
}

export class inscriptionDto {
  @IsNotEmpty()
  userName: string;

  @IsNotEmpty()
  @Length(6)
  password: string;

  @IsNotEmpty()
  situation: situation;

  @IsNotEmpty()
  babyGender: babyGender;

  @IsNotEmpty()
  babyAge: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEmpty()
  photoProfile: String;

  @IsEmpty()
  verified: string;

  @IsEmpty()
  ableToChangePassword;

  @IsEmpty()
  role: userType;
}
export class ConfirmEmailToUpadatePasswordDto {
  @IsNotEmpty()
  email: string;
}

export class SignInresult {
  access_token: String;

  refresh_token: String;
}
