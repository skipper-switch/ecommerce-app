import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() userSignUpDto: UserSignUpDto,
  ): Promise<{ data: UserEntity; accessToken: string }> {
    return await this.authService.signup(userSignUpDto);
  }

  @Post('signin')
  async signin(
    @Body() userSignInDto: UserSignInDto,
  ): Promise<{ data: UserEntity; accessToken: string }> {
    return await this.authService.signin(userSignInDto);
  }
}
