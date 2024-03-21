import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { PrismaInterceptor } from 'src/common/interceptor/prisma.interceptor';
import { CategoryOutputMapper } from 'src/core/category/mapper/category-mapper';
import { CategoryOutput } from 'src/core/category/entities/category.entity';
import { CategoryService } from 'src/core/category/category.service';

@Controller('category')
@UseInterceptors(PrismaInterceptor)
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Get()
  async findMany(): Promise<{ categories: CategoryOutput[] }> {
    const categories = await this._categoryService.findMany();
    return {
      categories: new CategoryOutputMapper().mapEntitiesToDto(categories),
    };
  }
}
