import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findOrCreate(data: Partial<User>): Promise<UserDocument> {
    let user = await this.userModel.findOne({ email: data.email });
    if (!user) user = await this.userModel.create(data);
    return user;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findPending(): Promise<UserDocument[]> {
    return this.userModel.find({ status: 'pending' }).exec();
  }

  async findApproved(): Promise<UserDocument[]> {
    return this.userModel.find({ status: 'approved' }).exec();
  }

  async approve(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(
      id, { status: 'approved' }, { new: true },
    );
  }

  async saveTelegramId(email: string, chatId: string): Promise<UserDocument | null> {
    return this.userModel.findOneAndUpdate(
      { email }, { telegramChatId: chatId }, { new: true },
    );
  }
}