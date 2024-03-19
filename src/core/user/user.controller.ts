import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ReqUser } from 'src/auth/decorator/user.decorator';
import { UserService } from 'src/core/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  async myProfile(@ReqUser() user: User) {
    // Get last user data
    const userData = await this._userService.findOneById(user.id);

    return {
      id: userData.id,
      email: userData.email,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
  }
}
