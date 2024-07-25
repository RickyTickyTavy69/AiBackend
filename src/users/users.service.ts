import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from 'mongoose';


import { User } from './schema/user.schema';
import { UserDto } from './dto/user.dto';


@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async createUser(user: User){
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findOne(username: string){
    return this.userModel.findOne({username});
  }
}
