import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/core/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _userService: UserService,
    _configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: _configService.getOrThrow('JWT_AUTH_SECRET'),
    });
  }

  async validate(payload: { id: number; iat: Date; exp: Date }): Promise<User> {
    try {
      const user = await this._userService.findOneById(payload.id);
      // inject user data to request
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private static extractJwtFromCookie(req: Request): string | null {
    const jwtInCookie = req?.cookies?.userToken;

    if (jwtInCookie) {
      return jwtInCookie;
    }

    return null;
  }
}
