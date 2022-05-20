import { InformationService } from './information.service';
import {
  CREATE_INFORMATION,
  DELETE_INFORMATION,
  EDIT_INFORMATION,
  GET_INFORMATIONS,
  GET_ONE_INFORMATION,
} from './../constantes';
import { MessagePattern } from '@nestjs/microservices';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller } from '@nestjs/common';

@Controller()
export class InformationsController {
  constructor(private readonly informationService: InformationService) {}
  @MessagePattern(CREATE_INFORMATION)
  createNewInformationController({ title, section, content, media }) {
    console.log(title);
    return this.informationService.createNewInformationService({
      title,
      media,
      content,
      section,
    });
  }

  @MessagePattern(DELETE_INFORMATION)
  deleteInforamtionController(id_information: string) {
    return this.informationService.deleteInforamtionService(id_information);
  }
  @MessagePattern(EDIT_INFORMATION)
  editeINforamtionController({ id_information, attributes }) {
    return this.informationService.editeInforamtionService(
      id_information,
      attributes,
    );
  }
  @MessagePattern(GET_INFORMATIONS)
  getInfomrationsController(information) {
    return this.informationService.getInfomrationsService(information);
  }
  @MessagePattern(GET_ONE_INFORMATION)
  getOneInfromationByIdController(id_information: string) {
    return this.informationService.getOneInfromationByIdService(id_information);
  }
}
