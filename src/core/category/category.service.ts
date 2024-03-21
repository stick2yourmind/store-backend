import { Injectable } from '@nestjs/common';
import { Category } from '@prisma/client';
import { PrismaService } from 'src/db/orm/orm.service';

@Injectable()
export class CategoryService {
  constructor(private readonly _prismaService: PrismaService) {}

  async findMany(): Promise<Category[]> {
    return await this._prismaService.category.findMany();
  }
}
