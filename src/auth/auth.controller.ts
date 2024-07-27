import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import {AuthService } from './auth.service';
import {UserDto} from '../users/dto/user.dto';
import { Public } from './public-strategy';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ){}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({summary: "User Login"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User Login Successfully",
    type: [UserDto]
  })
  login(@Body() SignInDto: UserDto){
    return this.authService.signIn(SignInDto.username, SignInDto.password)
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOperation({summary: "User SignUp"})
  @ApiResponse({
    status: HttpStatus.OK,
    description: "User signUp successfully",
    type: [UserDto]
  })
  async signUp(@Body() singUpDto: UserDto, res: Response){
    const signUpData = await this.authService.signUp(singUpDto);
    res.cookie("refresh_token", signUpData.refresh_token, {maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true});
    return signUpData;
  }
}
