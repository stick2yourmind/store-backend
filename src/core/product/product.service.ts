import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'src/core/product/dto/filter.query';
import { PaginationQuery } from 'src/core/product/dto/pagination.query';
import { ProductsWithCategory } from 'src/core/product/mapper/product-mapper';
import { PrismaService } from 'src/db/orm/orm.service';

@Injectable()
export class ProductService {
  constructor(private readonly _prismaService: PrismaService) {}

  async findOneById(id: number): Promise<ProductsWithCategory> {
    return await this._prismaService.product.findFirstOrThrow({
      where: { id },
      include: {
        category: true,
      },
    });
  }

  async findMany({
    offset,
    limit,
    category,
    query,
  }: PaginationQuery & FilterQuery): Promise<{ products: ProductsWithCategory[]; count: number }> {
    const products: ProductsWithCategory[] = await this._prismaService.product.findMany({
      orderBy: [{ name: 'desc' }, { id: 'asc' }],
      skip: offset,
      take: limit,
      include: {
        category: true,
      },
      where: {
        category: {
          some: { id: category },
        },
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    const count = await this._prismaService.product.count({
      where: {
        category: {
          some: {
            id: category,
          },
        },
        name: {
          contains: query,
          mode: 'insensitive',
        },
      },
    });
    return { products, count };
  }
}
