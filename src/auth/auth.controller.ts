import { Response } from 'express';
import { Controller, Post, Body, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignInInput } from 'src/auth/dto/sign-in.input.dto';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { PrismaInterceptor } from 'src/common/interceptor/prisma.interceptor';

@Controller('auth')
@UseInterceptors(PrismaInterceptor)
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Res({ passthrough: true }) res: Response, @Body() signInInput: SignInInput) {
    const user = await this._authService.signIn(signInInput);

    this._authService.setCookie(res, user.token);
    return user;
  }

  @Post('sign-up')
  async signUp(@Res({ passthrough: true }) res: Response, @Body() signUpInput: SignUpInput) {
    const user = await this._authService.signUp(signUpInput);

    this._authService.setCookie(res, user.token);
    return user;
  }

  @Post('sign-out')
  async logout(@Res({ passthrough: true }) res: Response) {
    this._authService.clearCookie(res);
    return { success: true };
  }
}
