import { privilege } from './../enum';
import { QuestionDto } from './faq.dto';
import { Question } from './faq.models';
/*
https://docs.nestjs.com/providers#services
*/
import { ConflictException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {}

  async createQuestionService(payload: {
    content: string;
    requested: boolean;
    answer: string;
    addedBy: string;
  }) {
    console.log(payload);
    try {
      const newQuestion = (
        await this.questionModel.create({
          content: payload.content,
          requested: payload.requested,
          answer: payload.answer,
          addedBy: payload.addedBy,
        })
      ).save();

      return await newQuestion;
    } catch (e) {
      return new ConflictException(e);
    }
  }
  async upadteQuestionService({ attributes, id_question, editedby }) {
    const attribute = { ...attributes, editedby };
    console.log({ attribute });
    return await this.questionModel.updateOne(
      { _id: id_question },
      { ...attribute },
    );
  }
  async GetQuestionByIdService(id_question: string) {
    const question = await this.questionModel.findById(id_question);
    if (question) {
      return { question };
    } else {
      return { message: 'this ' + id_question + ' does not existe' };
    }
  }
  async GetAllQuestionsService(role: string) {
    console.log(role);
    switch (role) {
      case privilege.SUPERADMIN:
        return await this.questionModel.find();
      case privilege.SCIENTIST:
        return await this.questionModel.find();
      case privilege.MEMEBER:
        return await this.questionModel.find({ requested: false });
      default:
        return { message: 'something wont wrong' };
    }
  }
  async deleteQuestionService(id: string) {
    const question = await this.questionModel.findOne({ _id: id });
    console.log(question);
    if (question) {
      const deleted = await this.questionModel.deleteOne({ _id: id });
      if (deleted) {
        return { message: 'question has been deleted' };
      } else {
        return { message: 'something went wrong' };
      }
    } else {
      return { message: 'this Id does not exist' };
    }
  }
}
