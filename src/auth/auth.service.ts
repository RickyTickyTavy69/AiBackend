import { Injectable, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import {Token, TokenSchema } from './schema/token.schema';
import { Model } from 'mongoose';



@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectModel(Token.name) private tokenModel: Model<Token>
  ) {}

  async signIn(username: string, password: string){

    const user = await this.usersService.findOne(username);

    if(!user){
      console.log("no user found");
      throw new UnauthorizedException();
    }

    const match = await bcrypt.compare(password, user.password);

    if(!match){
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id,
      username: user.username
    }

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "7d"
    })

    const tokenData = await this.tokenModel.findOne({User: user._id});

    if(tokenData){
      tokenData.refreshToken = refreshToken;
      await tokenData.save();
    }else{
      await this.tokenModel.create({User: user._id, refreshToken: refreshToken});
    }

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: refreshToken,
      userData: user,
    };
  }

  async signUp(signUpDto: UserDto){
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(signUpDto.password, saltOrRounds);

    const user = await this.usersService.createUser({
      username: signUpDto.username,
      password: hashedPassword,
    });

    const payload = {
      sub: user._id,
      username: user.username
    }

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: "7d"
    })

    await this.tokenModel.create({User: user._id, refreshToken: refreshToken});

    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: refreshToken,
      userData: user,
    };

  }
}
