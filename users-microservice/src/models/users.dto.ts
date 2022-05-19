import { IsEmail, IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { BabyGender, privilege, Situation, UserType } from 'src/utils/enum';

export class adminDto {
  @IsNotEmpty()
  identifier: string;
  @IsNotEmpty()
  @Length(6)
  password: string;
  @IsNotEmpty()
  privilege: privilege;
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
  situation: Situation;

  @IsNotEmpty()
  babyGender: BabyGender;

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
  role: UserType;
}
export class ConfirmEmailToUpadatePasswordDto {
  @IsNotEmpty()
  email: string;
}

export class SignInresult {
  access_token: String;

  refresh_token: String;
}
