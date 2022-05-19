//import { registerEnumType } from '@nestjs/graphql';

export enum situation {
  EXPECTANT_NEW_BABY = 'EXPECTANT_NEW_BABY',
  PERENT = 'PARENT',
  PARENT_AND_EXPECTANT_NEW_BABY = 'PARENT_AND_EXPECTANT_NEW_BABY',
}

export enum userType {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
export enum babyGender {
  BOY = 'BOY',
  GIRL = 'GIRL',
}
export enum privilege {
  SUPERADMIN = 'SUPERADMIN',
  SCIENTIST = 'SCIENTIST',
  MEMEBER = 'MEMBER',
}
export enum level {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
}
// registerEnumType(Situation, {
//   name: 'Situation',
// });

// registerEnumType(UserType, {
//   name: 'UserType',
// });

// registerEnumType(BabyGender, {
//   name: 'BabyGender',
// });
