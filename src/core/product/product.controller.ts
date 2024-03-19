import { ProducOutput } from './entities/product.entity';
import { Controller, Get, Param, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { PrismaInterceptor } from 'src/common/interceptor/prisma.interceptor';
import { PaginationQuery } from 'src/core/product/dto/pagination.query';
import { ProductOutputMapper } from 'src/core/product/mapper/product-mapper';
import { FilterQuery } from 'src/core/product/dto/filter.query';

@Controller('product')
@UseInterceptors(PrismaInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOneById(id);
  }

  @Get()
  async findMany(
    @Query() { limit, offset }: PaginationQuery,
    @Query() { category, query }: FilterQuery,
  ): Promise<{ products: ProducOutput[]; total: number }> {
    const { count, products } = await this.productService.findMany({ limit, offset, category, query });
    // const promise = new Promise((r) => setTimeout(r, 5000));
    // await promise;
    return {
      products: new ProductOutputMapper().mapEntitiesToDto(products),
      total: count,
    };
  }
}
