//import { registerEnumType } from '@nestjs/graphql';

export enum Situation {
  EXPECTANT_NEW_BABY = 'EXPECTANT_NEW_BABY',
  PERENT = 'PARENT',
  PARENT_AND_EXPECTANT_NEW_BABY = 'PARENT_AND_EXPECTANT_NEW_BABY',
}

export enum UserType {
  MEMBER = 'MEMBER',
  DOCTOR = 'DOCTOR',
}
export enum BabyGender {
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
  MODERATE = 'MODERATE',
  WITH_EFFORT = 'WITH_EFFORT',
}
export enum rating {
  NORMAL = 'NORMAL',
  NICE = 'NICE',
  VERY_GREAT = 'VERY_GREAT',
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
