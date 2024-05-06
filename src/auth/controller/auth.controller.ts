import {
  Body,
  Controller,
  Post,
  Get,
  ValidationPipe,
  Res,
  Request,
  HttpStatus,
  NotFoundException,
  ConflictException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../service/auth.service';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { AuthUserLoginDto } from '../dto/auth-user-login.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signup(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
    @Res() res: Response,
  ) {
    const message = await this.authService.signUp(authCredentialsDto);
    return res.status(HttpStatus.CREATED).json({ message });
  }

  @Post('/login')
  async login(
    @Body(ValidationPipe) authUserLoginDto: AuthUserLoginDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.authService.login(authUserLoginDto);
      return res.status(HttpStatus.OK).json({ ...result });
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Login failed',
        error: error.message || 'Invalid credentials',
      });
    }
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
