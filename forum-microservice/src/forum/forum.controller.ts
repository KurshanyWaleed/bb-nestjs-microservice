import { EDIT_GROUP, GET_ONE_GROUP } from './../constantes';
import { MessagePattern } from '@nestjs/microservices';
import { ForumService } from './forum.service';
/*
https://docs.nestjs.com/controllers#controllers
*/
import { GroupDto } from './newGroupDto';
import { Controller } from '@nestjs/common';
import {
  CREATE_POST,
  CREATE_REPLY,
  GET_GROUPS,
  NEW_GROUP,
  REQUEST_TO_JOIN_GROUP,
} from 'src/constantes';

@Controller()
export class ForumController {
  constructor(private readonly forumService: ForumService) {}
  @MessagePattern(NEW_GROUP)
  async createGroup(data: GroupDto) {
    console.log(data);
    return await this.forumService.createGroupService(data);
  }
  @MessagePattern(REQUEST_TO_JOIN_GROUP)
  async joinRequest(payload: { _id: string; group_id: string }) {
    console.log(payload.group_id);
    return this.forumService.joinToGroup(payload);
  }
  @MessagePattern(GET_ONE_GROUP)
  getOneGroupController(group_id: string) {
    return this.forumService.getOneGroupService(group_id);
  }
  @MessagePattern(GET_GROUPS)
  getGroupsController(grouptitle: string) {
    console.log(grouptitle);
    return this.forumService.getGroupsService(grouptitle);
  }
  @MessagePattern(EDIT_GROUP)
  editGroupController({ group_id, attributes }) {
    return this.forumService.editGroupService(group_id, attributes);
  }
  //!-----------------------------------------------
  @MessagePattern(CREATE_POST)
  async createPostController({ from, group, content, media }) {
    return await this.forumService.createPostService({
      from,
      group,
      content,
      media,
    });
  }
  @MessagePattern(CREATE_REPLY)
  async createReplyController({ from, post, content, media }) {
    return await this.forumService.createReplyService({
      from,
      post,
      content,
      media,
    });
  }
}
