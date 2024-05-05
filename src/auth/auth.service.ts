import { Injectable } from '@nestjs/common';
import { AuthUserLoginDto } from './dto/auth-user-login.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './entity/user.entity';
import * as bcrypt from 'bcryptjs';

const salt = 10;

@Injectable()
export class AuthService {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, email, phone, address, password } = authCredentialsDto;

    try {
      const data = await User.findOneBy({ email: email });

      if (!data) {
        const user = new User();

        const hashedPassword = await this.hashPassword(password);

        user.username = username;
        user.email = email;
        user.phone = phone;
        user.address = address;
        user.password = hashedPassword;

        await user.save();

        return 'User signup successful';
      } else {
        return 'User already registered';
      }
    } catch (err) {
      console.log(err);
    }
  }

  login(authUserLoginDto: AuthUserLoginDto) {
    console.log('authUserLoginDto', authUserLoginDto);
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);

    return hash;
  }
}
