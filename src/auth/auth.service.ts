import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { SignInInput } from 'src/auth/dto/sign-in.input.dto';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { UserService } from 'src/core/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    private readonly _userService: UserService,
  ) {}

  async signIn({ email, password }: SignInInput) {
    const user = await this._userService.findByEmail(email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid password or email');
    }

    const token = this._jwtService.sign({ id: user.id });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async signUp(signUpInput: SignUpInput) {
    const passwordHash = bcrypt.hashSync(
      signUpInput.password,
      Number(this._configService.getOrThrow('HASH_SALT')),
    );
    const user = await this._userService.create({
      password: passwordHash,
      email: signUpInput.email,
    });

    const token = this._jwtService.sign({ id: user.id });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  setCookie(res: Response, token: string) {
    res.cookie('userToken', token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: this._configService.getOrThrow('NODE_ENV') === 'PROD',
      secure: true,
      sameSite: 'none',
    });
  }

  clearCookie(res: Response) {
    res.cookie('userToken', '', {
      expires: new Date(Date.now()),
      httpOnly: this._configService.getOrThrow('NODE_ENV') === 'PROD',
      secure: true,
      sameSite: 'none',
    });
  }
}
