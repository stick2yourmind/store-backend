import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Min, ValidateNested } from 'class-validator';

export class ProductOrderInput {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(1)
  id: number;
}

export class CreateOrderInput {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductOrderInput)
  products: ProductOrderInput[];
}
