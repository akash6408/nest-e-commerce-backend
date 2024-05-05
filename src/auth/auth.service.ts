import { Injectable } from '@nestjs/common';
import { AuthUserLoginDto } from './dto/auth-user-login.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return;
  }

  login(authUserLoginDto: AuthUserLoginDto) {}
}
