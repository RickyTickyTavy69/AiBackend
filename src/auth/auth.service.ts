import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(username: string, password: string){

    const user = await this.usersService.findOne(username);

    if(!user){
      console.log("no user found");
      throw new UnauthorizedException();
    }

    const match = user.password === password;

    if(!match){
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user._id,
      username: user.username
    }

    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }

  async signUp(signUpDto: UserDto){
    const user = await this.usersService.createUser({
      username: signUpDto.username,
      password: signUpDto.password,
      confirmPassword: "",
      designation: "",
    });
    return user;
  }
}
