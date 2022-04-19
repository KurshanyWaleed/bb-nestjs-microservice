/*
https://docs.nestjs.com/providers#services
*/
import mongoose from 'mongoose';

import { Model } from 'mongoose';
import { Reply } from './reply.model';
import {
  BadGatewayException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Group } from './group.model';
import { Post } from './post.model';
import { GroupDto } from './newGroupDto';
import { CONFIRM_GROUP_JOIN, USERS } from 'src/constantes';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ForumService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
    @InjectModel(Reply.name) private readonly replyModel: Model<Reply>,
    @Inject(USERS) private readonly userMicroService: ClientProxy,
  ) {}

  async createGroupService(data: GroupDto) {
    try {
      const newGroup = (await this.groupModel.create(data)).save();
      return await newGroup;
    } catch (e) {
      return new ConflictException();
    }
  }
  async joinToGroup(payload: { _id: string; groupTitle: string }) {
    console.log(payload.groupTitle);
    console.log(payload._id);

    try {
      const group_id = await this.groupModel.findOne({
        title: payload.groupTitle,
      });

      const isExist = (
        await this.groupModel.findOne({ title: payload.groupTitle })
      ).members.filter((user) => payload._id == user._id);
      if (!isExist) {
        const group = await this.groupModel.updateOne(
          {
            title: payload.groupTitle,
          },
          {
            $push: {
              members: payload._id,
            },
          },
        );
        // ! heeeeeeeeeeeeeeeeeeeeeeeer i stoped
        if (group) {
          this.userMicroService.emit(CONFIRM_GROUP_JOIN, {
            group_id: group_id,
          });
          return {
            message: 'you become a memebes of ' + payload.groupTitle + ' now !',
          };
        } else {
          return {
            message: 'this group ' + payload.groupTitle + ' does not exist',
          };
        }
      } else {
        return { message: 'You are already in this group ' };
      }
    } catch (e) {
      return new BadGatewayException(e);
    }
  }
  deleteGroup() {}
}
