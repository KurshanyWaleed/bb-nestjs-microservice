import {
  UPDATE_QUESTION,
  GET_QUESTION_BY_ID,
  GET_ALL_QUESTIONS,
  DELETE_QUESTION,
} from './../constantes';
import { FaqService } from './faq.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { NEW_QUESTION } from 'src/constantes';
import { identity } from 'rxjs';

@Controller()
export class FaqController {
  constructor(private readonly faqService: FaqService) {}
  @MessagePattern(NEW_QUESTION)
  createNewQuestion(payload: {
    content: string;
    requested: boolean;
    answer: string;
    addedBy: string;
  }) {
    console.log('thisss ' + payload);
    return this.faqService.createQuestionService(payload);
    //return payload;

    //return this.userService.createNewQuestionService(payload);
  }

  @MessagePattern(UPDATE_QUESTION)
  updateQuestion(payload: {
    attributes: string;
    id_question: string;
    editedby: string;
  }) {
    return this.faqService.upadteQuestionService(payload);
  }

  @MessagePattern(GET_QUESTION_BY_ID)
  getQuestion(id_question: string) {
    return this.faqService.GetQuestionByIdService(id_question);
  }
  @MessagePattern(GET_ALL_QUESTIONS)
  getAllQuestion(role: string) {
    return this.faqService.GetAllQuestionsService(role);
  }

  @MessagePattern(DELETE_QUESTION)
  deleteQuestion(id_question: string) {
    return this.faqService.deleteQuestionService(id_question);
  }
}
