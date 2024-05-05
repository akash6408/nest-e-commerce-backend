import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthUserLoginDto } from '../dto/auth-user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.authService.signUp(authCredentialsDto);
    return res.status(HttpStatus.CREATED).json({ msg: result });
  }

  @Post('/login')
  async login(@Body(ValidationPipe) authUserLoginDto: AuthUserLoginDto) {
    const result = await this.authService.login(authUserLoginDto);
  }
}
