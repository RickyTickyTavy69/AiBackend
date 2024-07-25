import { Controller, Post, HttpCode, HttpStatus, Body } from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  signUp(@Body() singUpDto: UserDto){
    return this.authService.signUp(singUpDto)
  }
}
