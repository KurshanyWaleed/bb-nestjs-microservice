import { Model } from 'mongoose';
import { Information } from './information.model';
/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InformationService {
  constructor(
    @InjectModel('Information')
    private readonly informationModel: Model<Information>,
  ) {}
  async createNewInformationService({ title, section, content, media }) {
    const newInforamtion = await (
      await this.informationModel.create({ title, section, content, media })
    ).save();
    return { message: 'new Information has been added ' };
  }
  async deleteInforamtionService(id_information: string) {
    if (await this.informationModel.findOne({ _id: id_information })) {
      const deleteed = await this.informationModel.deleteOne({
        _id: id_information,
      });

      return { message: 'Information has been deleted' };
    } else {
      return { message: 'this Id does not exist' };
    }
  }
  async editeInforamtionService(id_information: string, attributes: any) {
    if (await this.informationModel.findById({ _id: id_information })) {
      const added = await this.informationModel.updateOne(
        { _id: id_information },
        { ...attributes },
      );
      if (added) return { message: 'Inforamtion has been added' };
    } else {
      return { message: 'this id doas not exist' };
    }
  }
  async getInfomrationsService(information?: string) {
    return await this.informationModel.find();
  }
  async getOneInfromationByIdService(id_information: string) {
    return await this.informationModel.findById({ _id: id_information });
  }
}
