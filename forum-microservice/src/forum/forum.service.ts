/*
https://docs.nestjs.com/providers#services
*/
import mongoose from 'mongoose';

import { Model } from 'mongoose';
import { Reply } from './reply.model';
import {
  BadGatewayException,
  BadRequestException,
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
  //-----------------------------------get groups
  async createGroupService(data: GroupDto) {
    try {
      const newGroup = await await this.groupModel.create(data);
      return newGroup;
    } catch (e) {
      return new ConflictException(e);
    }
  }
  async joinToGroup(payload: { _id: string; group_id: string }) {
    console.log('user : ' + payload._id);
    console.log('group ' + payload.group_id);

    try {
      const group_id = await this.groupModel.findOne({
        title: payload.group_id,
      });

      const isExist = (
        await this.groupModel.findOne({ _id: payload.group_id })
      ).members.filter((user) => payload._id == user._id);
      console.log(isExist.length);
      if (isExist.length == 0) {
        const group = await this.groupModel.updateOne(
          {
            _id: payload.group_id,
          },
          {
            $push: {
              members: payload._id,
            },
          },
        );
        // !
        if (group) {
          // this.userMicroService.emit(CONFIRM_GROUP_JOIN, {
          //   group_id: group_id,

          return {
            message: 'you become a memebes of ' + payload.group_id + ' now !',
          };
        } else {
          return {
            message: 'this group ' + payload.group_id + ' does not exist',
          };
        }
      } else {
        return { message: 'You are already in this group ' };
      }
    } catch (e) {
      return new BadGatewayException(e);
    }
  }
  async getGroupsService(grouptitle: string) {
    return (
      await this.groupModel
        .find({ title: grouptitle })
        .populate('postes', 'members')
    ).filter((qst) => {
      return (
        qst.title.slice(0, grouptitle.length).toLocaleLowerCase() ==
        grouptitle.toLocaleLowerCase()
      );
    });
  }
  async getOneGroupService(group_id: string) {
    console.log(group_id);
    try {
      const group = await this.groupModel.findById({ _id: group_id });

      return group;
    } catch (e) {
      return new BadRequestException('somethig went wrong' + e);
    }
  }
  async editGroupService(group_id: string, attributes: any) {
    try {
      const group = await this.groupModel.findById({ _id: group_id });

      if (group) {
        await this.groupModel.updateOne({ _id: group_id }, { ...attributes });
      } else {
        return { message: 'somthing went wront' };
      }
    } catch (e) {
      new BadRequestException('somethig went wrong');
    }
  }
  //------------------------------------postes
  async createPostService({ from, group, content, media }) {
    const post = await (
      await this.postModel.create({ from, group, content, media })
    ).populate('group');
    const newgroupPost = await this.groupModel
      .updateOne({ _id: group }, { $push: { postes: post._id } })
      .populate('postes');
    if (post && newgroupPost) {
      return { mesage: 'post created', data: post };
    } else {
      return {
        message: 'somthing went wrong',
      };
    }
  }
  async createReplyService({ from, post, content, media }) {
    const reply = await this.replyModel.create({ from, post, content, media });

    if (reply) {
      return { mesage: 'reply created' };
    } else {
      return {
        message: 'somthing went wrong',
      };
    }
  }
}
