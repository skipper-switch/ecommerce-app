import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoriesRepository: Repository<CategoryEntity>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    currentUser: UserEntity,
  ): Promise<{ status: string; statusCode: number; data: CategoryEntity }> {


    const category = this.categoriesRepository.create(createCategoryDto);

    category.addedBy = currentUser;

    const savedCategory = await this.categoriesRepository.save(category);

    return {
      status: 'Success',
      statusCode: 201,
      data: savedCategory,
    };
  }

   async findAll(): Promise<{
    count: number;
    statusCode: number;
    data: CategoryEntity[];
  }> {
    const categories = await this.categoriesRepository.find({
      relations: { addedBy: true },
      select: {
        addedBy: {
          _id: true,
          name: true,
          email: true,
        }
      }
    });

    return {
      count: categories.length,
      statusCode: 200,
      data: categories,
    };
  }

  async findOne(
    categoryId: string,
  ): Promise<{ status: string; statusCode: number; data: CategoryEntity }> {
    const category = await this.categoriesRepository.findOne({
      where: { _id: new ObjectId(categoryId) },
      relations: { addedBy: true },
      select: {
        addedBy: {
          _id: true,
          name: true,
          email: true,
        }
      }
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return {
      status: 'Success',
      statusCode: 200,
      data: category,
    };
  }

  async update(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<{ status: string; statusCode: number; data: CategoryEntity }> {
    const category = await this.categoriesRepository.findOne({
      where: { _id: new ObjectId(categoryId) },
      relations: { addedBy: true },
      select: {
        addedBy: {
          _id: true,
          name: true,
          email: true
        }
      }
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    Object.assign(category, updateCategoryDto);

    const updatedCategory = await this.categoriesRepository.save(category);

    return {
      status: 'Success',
      statusCode: 200,
      data: updatedCategory,
    };
  }

  async remove(categoryId: string): Promise<{
    statusCode: number;
    status: string;
    message: string;
  }> {
    const category = await this.categoriesRepository.findOneBy({
      _id: new ObjectId(categoryId),
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    await this.categoriesRepository.delete(categoryId);

    return {
      statusCode: 200,
      status: 'Success',
      message: 'Category deleted successfully',
    };
  }

 
}
