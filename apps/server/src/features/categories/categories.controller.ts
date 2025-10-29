import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  TCreateCategory,
  TUpdateCategory,
  TCategoryBasic,
  ZCreateCategory,
  ZUpdateCategory,
  ZCategoryQueryUnique,
  ZCategoryQueryFilter,
  TCategoryQueryFilter,
} from '@repo/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @HttpCode(201)
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZCreateCategory))
  async create(@Body() data: TCreateCategory): Promise<TCategoryBasic> {
    return this.categoriesService.create(data);
  }

  @Get()
  @UsePipes(QueryPipe(ZCategoryQueryFilter as any))
  getMany(@Query() query: TCategoryQueryFilter): Promise<TCategoryBasic[]> {
    return this.categoriesService.getMany(query);
  }

  @Get(':id')
  @UsePipes(QueryPipe(ZCategoryQueryUnique as any))
  getOne(@Param('id') id: string): Promise<TCategoryBasic> {
    return this.categoriesService.getOne({ id });
  }

  @Put(':id')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZUpdateCategory))
  update(
    @Param('id') id: string,
    @Body() data: TUpdateCategory,
  ): Promise<TCategoryBasic> {
    return this.categoriesService.update({ id }, data);
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZCategoryQueryUnique as any))
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.categoriesService.delete({ id });
  }
}
