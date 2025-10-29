import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { CurrentUser } from '@/decorators/current-user.decorator';
import {
  TAddressQueryFilter,
  TAddressQueryUnique,
  TAuthUser,
  TCreateAddress,
  TUpdateAddress,
  ZAddressQueryFilter,
  ZAddressQueryUnique,
  ZCreateAddress,
  ZUpdateAddress,
} from '@repo/common';
import { AddressesService } from './addresses.service';
import { QueryPipe } from '@/pipes/query.pipe';
import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import { RolesService } from '../roles/roles.service';
@Controller('addresses')
@UseGuards(UserAuthGuard)
export class AddressesController {
  constructor(
    private addressesService: AddressesService,
    private rolesService: RolesService
  ) { }

  @Post()
  @UsePipes(BodyPipe(ZCreateAddress))
  async create(@CurrentUser() user: TAuthUser, @Body() data: TCreateAddress) {
    return this.addressesService.create(user.id, data);
  }

  @Get()
  @UsePipes(QueryPipe(ZAddressQueryFilter))
  async getMany(
    @CurrentUser() user: TAuthUser,
    @Query() query: TAddressQueryFilter,
  ) {
    return this.addressesService.getMany(user.id, query);
  }

  @Get('admin')
  @UseGuards(UserAuthGuard)
  @UsePipes(QueryPipe(ZAddressQueryFilter))
  async getAllAddresses(
    @CurrentUser() user: TAuthUser,
    @Query() query: TAddressQueryFilter,
  ) {
    const canViewAll = this.rolesService.can(user, 'setting', 'viewMany');
    if (!canViewAll) {
      throw new UnauthorizedException('You are not authorized to access this resource');
    }
    return this.addressesService.getAllAddresses(query);
  }

  @Get(':id')
  @UsePipes(QueryPipe(ZAddressQueryUnique))
  async getOne(
    @CurrentUser() user: TAuthUser,
    @Param() params: TAddressQueryUnique,
  ) {
    return this.addressesService.getOne(user.id, params);
  }

  @Put(':id')
  @UsePipes(BodyPipe(ZUpdateAddress))
  @UsePipes(QueryPipe(ZAddressQueryUnique))
  async update(
    @CurrentUser() user: TAuthUser,
    @Param() params: TAddressQueryUnique,
    @Body() data: TUpdateAddress,
  ) {
    return this.addressesService.update(user.id, params, data);
  }

  @Delete(':id')
  @UsePipes(QueryPipe(ZAddressQueryUnique))
  async delete(
    @CurrentUser() user: TAuthUser,
    @Param() params: TAddressQueryUnique,
  ) {
    return this.addressesService.delete(user.id, params);
  }
}
