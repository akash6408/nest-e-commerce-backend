import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthUserLoginDto } from '../dto/auth-user-login.dto';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

const salt = 10;

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, email, phone, address, password } = authCredentialsDto;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: [{ email }, { username }],
    });

    if (existingUser) {
      throw new HttpException('User already exists', 409);
    }

    try {
      // Create new user
      const user = new User();

      const hashedPassword = await this.hashPassword(password);

      user.username = username;
      user.email = email;
      user.phone = phone;
      user.address = address;
      user.password = hashedPassword;

      await user.save();

      return 'User signup successful';
    } catch (err) {
      throw new HttpException(
        'Signup failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(authUserLoginDto: AuthUserLoginDto) {
    const { username, password } = authUserLoginDto;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.username, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
}
