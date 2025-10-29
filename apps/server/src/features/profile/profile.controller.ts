import { UserAuthGuard } from '@/guards/auth.guard';
import { BodyPipe } from '@/pipes/body.pipe';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { TAuthUser, TOrderBasic, TUserBasic } from '@repo/common';
import { ProfileService } from './profile.service';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { z } from 'zod';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Get('my')
  @UseGuards(UserAuthGuard)
  async getMyProfile(@CurrentUser() user: TAuthUser): Promise<{
    user: TUserBasic;
    totalOrders: number;
    totalSpent: number;
    addresses: any[];
  }> {
    return this.profileService.getMyProfile(user.id);
  }

  @Get('orders')
  @UseGuards(UserAuthGuard)
  async getMyOrders(@CurrentUser() user: TAuthUser): Promise<TOrderBasic[]> {
    return this.profileService.getMyOrders(user.id);
  }

  @Get('addresses')
  @UseGuards(UserAuthGuard)
  async getMyAddresses(@CurrentUser() user: TAuthUser): Promise<any[]> {
    return this.profileService.getMyAddresses(user.id);
  }

  @Post('addresses')
  @HttpCode(201)
  @UseGuards(UserAuthGuard)
  @UsePipes(
    BodyPipe(
      z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        zipCode: z.string(),
        isDefault: z.boolean().optional(),
      }),
    ),
  )
  async addAddress(
    @CurrentUser() user: TAuthUser,
    @Body() data: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      isDefault?: boolean;
    },
  ): Promise<any> {
    return this.profileService.addAddress(user.id, data);
  }

  @Put('addresses/:id')
  @UseGuards(UserAuthGuard)
  @UsePipes(
    BodyPipe(
      z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        zipCode: z.string(),
        isDefault: z.boolean().optional(),
      }),
    ),
  )
  async updateAddress(
    @CurrentUser() user: TAuthUser,
    @Param('id') addressId: string,
    @Body() data: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      isDefault?: boolean;
    },
  ): Promise<any> {
    return this.profileService.updateAddress(user.id, addressId, data);
  }

  @Delete('addresses/:id')
  @UseGuards(UserAuthGuard)
  async deleteAddress(
    @CurrentUser() user: TAuthUser,
    @Param('id') addressId: string,
  ): Promise<{ message: string }> {
    await this.profileService.deleteAddress(user.id, addressId);
    return { message: 'Address deleted successfully' };
  }

  @Put('addresses/:id/default')
  @UseGuards(UserAuthGuard)
  async setDefaultAddress(
    @CurrentUser() user: TAuthUser,
    @Param('id') addressId: string,
  ): Promise<{ message: string }> {
    await this.profileService.setDefaultAddress(user.id, addressId);
    return { message: 'Default address updated successfully' };
  }
}
