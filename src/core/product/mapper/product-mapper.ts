import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { ProducOutput } from 'src/core/product/entities/product.entity';
import { EntityDtoMapper } from 'utils/mapper';

export type ProductsWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export class ProductOutputMapper extends EntityDtoMapper<ProductsWithCategory, ProducOutput> {
  mapEntityToDto(product: ProductsWithCategory): ProducOutput {
    console.log('🚀 ~ file: product-mapper.ts:8 ~ ProductOutputMapper ~ mapEntityToDto ~ product:');
    return {
      createdAt: product.createdAt.toISOString(),
      description: product.description,
      id: product.id,
      image: product.image,
      name: product.name,
      price: new Decimal(product.price).toNumber(),
      stock: product.stock,
      updatedAt: product.updatedAt.toISOString(),
      category: product.category,
    };
  }
}
