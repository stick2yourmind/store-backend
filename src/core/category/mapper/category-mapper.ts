import { Category } from '@prisma/client';
import { CategoryOutput } from 'src/core/category/entities/category.entity';
import { EntityDtoMapper } from 'utils/mapper';

export class CategoryOutputMapper extends EntityDtoMapper<Category, CategoryOutput> {
  mapEntityToDto(category: Category): CategoryOutput {
    return {
      createdAt: category.createdAt.toISOString(),
      description: category.description,
      id: category.id,
      name: category.name,
      updatedAt: category.updatedAt.toISOString(),
    };
  }
}
