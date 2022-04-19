import { MessagePattern } from '@nestjs/microservices';
import { ForumService } from './forum.service';
/*
https://docs.nestjs.com/controllers#controllers
*/
import { GroupDto } from './newGroupDto';
import { Controller } from '@nestjs/common';
import { NEW_GROUP, REQUEST_TO_JOIN_GROUP } from 'src/constantes';

@Controller()
export class ForumController {
  constructor(private readonly forumService: ForumService) {}
  @MessagePattern(NEW_GROUP)
  async createGroup(data: GroupDto) {
    console.log(data);
    return await this.forumService.createGroupService(data);
  }
  @MessagePattern(REQUEST_TO_JOIN_GROUP)
  async joinRequest(payload: { _id: string; groupTitle: string }) {
    return this.forumService.joinToGroup(payload);
  }
}
