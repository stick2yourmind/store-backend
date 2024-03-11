import { Response } from 'express';
import { Controller, Post, Body, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { SignUpInput } from 'src/auth/dto/sign-up.input';
import { PrismaInterceptor } from 'src/common/interceptor/prisma.interceptor';

@Controller('auth')
@UseInterceptors(PrismaInterceptor)
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Res({ passthrough: true }) res: Response, @Body() signUpInput: SignUpInput) {
    const user = await this._authService.signUp(signUpInput);

    this._authService.setCookie(res, user.token);
    return user;
  }
}
