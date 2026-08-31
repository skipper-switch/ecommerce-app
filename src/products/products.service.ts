import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductEntity } from './entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
   constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryService: CategoriesService,
  ) {}
  
 
   async create(
    createProductDto: CreateProductDto,
    currentUser: UserEntity,
  ): Promise<{
    status: string;
    statusCode: number;
    data: ProductEntity;
  }> {
    const category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    if (!category) {
      throw new NotFoundException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }
    const product = this.productRepository.create(createProductDto);
    product.category = category.data;
    product.addedBy = currentUser;

    const savedProduct = await this.productRepository.save(product);

    return {
      status: 'Success',
      statusCode: 201,
      data: savedProduct,
    };
  }

  async findAll(): Promise<{
    count: number;
    statusCode: number;
    data: ProductEntity[];
  }> {
    const products = await this.productRepository.find();

    return {
      count: products.length,
      statusCode: 200,
      data: products,
    };
  }

  async findOne(
    productId: string,
  ): Promise<{ status: string; statusCode: number; data: ProductEntity }> {
    const product = await this.productRepository.findOne({
      where: { _id: new ObjectId(productId) },
      relations: { addedBy: true, category: true },
      select: {
        addedBy: {
          _id: true,
          name: true,
          email: true,
        },
      },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    return {
      status: 'Success',
      statusCode: 200,
      data: product,
    };
  }
}
