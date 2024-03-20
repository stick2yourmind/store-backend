import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterQuery {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  category: number;
}
