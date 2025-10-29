import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { QueryPipe } from '@/pipes/query.pipe';
import {
  TAuthUser,
  TUpdateMe,
  TUserQueryFilter,
  ZUpdateMe, ZUpdateUser,
  ZUserQueryFilter
} from '@repo/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get('search')
  @UsePipes(QueryPipe(ZUserQueryFilter))
  @UseGuards(UserAuthGuard)
  search(@Query() query: TUserQueryFilter) {
    return this.usersService.search(query);
  }

  @Get('me')
  @UseGuards(UserAuthGuard)
  findMe(@CurrentUser() user: TAuthUser) {
    return this.usersService.getOne({ id: user.id });
  }

  @Put('me')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZUpdateMe))
  updateMe(@CurrentUser() user: TAuthUser, @Body() data: TUpdateMe) {
    return this.usersService.update({ id: user.id }, { ...data });
  }

  @Delete('me')
  @UseGuards(UserAuthGuard)
  deleteMe(@CurrentUser() user: TAuthUser) {
    return this.usersService.delete({ id: user.id });
  }

  // ==============================================
  @Get()
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZUserQueryFilter as any))
  findMany(@Query() query: TUserQueryFilter) {
    return this.usersService.getMany(query);
  }

  @Get(':id')
  @UseGuards(UserAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.getOne({ id });
  }

  @Put(':id')
  @UseGuards(UserAuthGuard)
  @UsePipes(BodyPipe(ZUpdateUser))
  updateUser(@Param('id') id: string, @Body() data: any) {
    return this.usersService.update({ id }, { ...data });
  }

  @Delete(':id')
  @UseGuards(UserAuthGuard)
  delete(@Param('id') id: string) {
    return this.usersService.delete({ id });
  }
  // =============================================================
}
