import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizationGuard } from 'src/utility/guards/authorization.guard';
import { AuthroizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @AuthroizeRoles(Roles.ADMIN)
  create(
    @Body() createCategoryDto: CreateCategoryDto,
    @CurrentUser() currentUser: UserEntity,
  ) {
    return this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }
  @Get(':categoryId')
  @UseGuards(AuthenticationGuard)
  async findOne(@Param('categoryId') categoryId: string) {
    return await this.categoriesService.findOne(categoryId);
  }

  @Patch(':id')
  update(
    @Param('id') _id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(_id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.categoriesService.remove(_id);
  }
}
