import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FilterQuery {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  query: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  category: string;
}
