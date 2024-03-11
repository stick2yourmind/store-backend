import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/db/orm/orm.service';

@Injectable()
export class UserService {
  constructor(private readonly _prismaService: PrismaService) {}

  async findOneById(id: number): Promise<User> {
    return await this._prismaService.user.findFirstOrThrow({ where: { id } });
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this._prismaService.user.findFirst({ where: { email } });
    return user;
  }

  async create(data: { email: string; password: string }): Promise<User> {
    const user = await this._prismaService.user.create({ data });
    return user;
  }
}
