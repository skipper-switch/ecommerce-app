import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be string' })
  title!: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be string' })
  description!: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be number & max decimal precission 2' },
  )
  @IsPositive({ message: 'Price must be positive number' })
  price!: number;

  @IsNotEmpty({ message: 'Stock is required' })
  @IsNumber({}, { message: 'Stock must be number' })
  @Min(0, { message: 'Stock must be positive number' })
  stock!: number;

  @IsNotEmpty({ message: 'Images is required' })
  @IsArray({ message: 'Images must be in array format' })
  images!: string[];

  @IsNotEmpty({ message: 'Category is required' })
  @IsString({ message: 'Category must be string' })
  categoryId!: string;
}
