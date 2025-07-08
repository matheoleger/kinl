import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterInput, SignInInput } from './contracts/auth.contract';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }

  async signIn({ email, password }: SignInInput): Promise<{ token: string }> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };
    const result = { token: await this.jwtService.signAsync(payload) };

    return result;
  }

  async register({ email, username, password }: RegisterInput) {
    const existingUser = await this.usersService.findOne(email);

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      email,
      username,
      password: hashedPassword,
    });

    if (!user) {
      throw new InternalServerErrorException('Failed to create user');
    }

    const { password: _, ...result } = user;

    return { result };
  }
}
