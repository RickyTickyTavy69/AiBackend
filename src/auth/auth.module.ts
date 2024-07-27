import { Module } from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core';
import {JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import {Token, TokenSchema} from './schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: "15min"}
    })
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    AuthService
  ],
  exports: [AuthService]
})
export class AuthModule {}
