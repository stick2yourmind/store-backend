import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { UserService } from 'src/core/user/user.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow('JWT_AUTH_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRATION'),
          },
        };
      },
    }),
  ],
  controllers: [],
  providers: [JwtStrategy, UserService],
  exports: [JwtStrategy],
})
export class AuthModule {}
