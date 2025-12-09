import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserAuthGuard, UserAuthOptions } from '@/guards/auth.guard';
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
    TCreateMedia,
    TUpdateMedia,
    TMediaBasic,
    TMediaQueryFilter,
    TMediaListResponse,
    TMediaDetail,
    ZCreateMedia,
    ZUpdateMedia,
    ZMediaQueryFilter,
    ZMediaQueryUnique,
    TCreateVideo,
    TUpdateVideo,
    TVideoBasic,
    TVideoQueryFilter,
    TVideoListResponse,
    TVideoDetail,
    ZCreateVideo,
    ZUpdateVideo,
    ZVideoQueryFilter,
    ZVideoQueryUnique,
    TCreateAudio,
    TUpdateAudio,
    TAudioBasic,
    TAudioQueryFilter,
    TAudioListResponse,
    TAudioDetail,
    ZCreateAudio,
    ZUpdateAudio,
    ZAudioQueryFilter,
    ZAudioQueryUnique,
    TCreatePhoto,
    TUpdatePhoto,
    TPhotoBasic,
    TPhotoQueryFilter,
    TPhotoListResponse,
    TPhotoDetail,
    ZCreatePhoto,
    ZUpdatePhoto,
    ZPhotoQueryFilter,
    ZPhotoQueryUnique,
    TCreateGallery,
    TUpdateGallery,
    TGalleryBasic,
    TGalleryQueryFilter,
    TGalleryListResponse,
    TGalleryDetail,
    ZCreateGallery,
    ZUpdateGallery,
    ZGalleryQueryFilter,
    ZGalleryQueryUnique,
    TAuthUser,
} from '@repo/common';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    // ==================== MEDIA ENDPOINTS ====================

    @Post()
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateMedia))
    async createMedia(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreateMedia,
    ): Promise<TMediaBasic> {
        return this.mediaService.createMedia(data, user.id);
    }

    @Get()
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZMediaQueryFilter as any))
    async getManyMedia(
        @CurrentUser() user: TAuthUser | null,
        @Query() query: TMediaQueryFilter,
    ): Promise<TMediaListResponse> {
        return this.mediaService.getManyMedia({ ...query, user });
    }

    @Get(':id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZMediaQueryUnique as any))
    async getOneMedia(
        @CurrentUser() user: TAuthUser | null,
        @Param('id') id: string,
    ): Promise<TMediaDetail> {
        return this.mediaService.getOneMedia({ id }, user);
    }

    @Put(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateMedia))
    async updateMedia(
        @Param('id') id: string,
        @Body() data: TUpdateMedia,
    ): Promise<TMediaBasic> {
        return this.mediaService.updateMedia({ id }, data);
    }

    @Delete(':id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZMediaQueryUnique as any))
    async deleteMedia(@Param('id') id: string): Promise<{ message: string }> {
        return this.mediaService.deleteMedia({ id });
    }

    // ==================== VIDEO ENDPOINTS ====================

    @Post('videos')
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateVideo))
    async createVideo(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreateVideo,
    ): Promise<TVideoBasic> {
        return this.mediaService.createVideo(data, user.id);
    }

    @Get('videos')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZVideoQueryFilter as any))
    async getManyVideos(
        @CurrentUser() user: TAuthUser | null,
        @Query() query: TVideoQueryFilter,
    ): Promise<TVideoListResponse> {
        return this.mediaService.getManyVideos({ ...query, user });
    }

    @Get('videos/:id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZVideoQueryUnique as any))
    async getOneVideo(
        @CurrentUser() user: TAuthUser | null,
        @Param('id') id: string,
    ): Promise<TVideoDetail> {
        return this.mediaService.getOneVideo({ id }, user);
    }

    @Put('videos/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateVideo))
    async updateVideo(
        @Param('id') id: string,
        @Body() data: TUpdateVideo,
    ): Promise<TVideoBasic> {
        return this.mediaService.updateVideo({ id }, data);
    }

    @Delete('videos/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZVideoQueryUnique as any))
    async deleteVideo(@Param('id') id: string): Promise<{ message: string }> {
        return this.mediaService.deleteVideo({ id });
    }

    // ==================== AUDIO ENDPOINTS ====================

    @Post('audios')
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateAudio))
    async createAudio(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreateAudio,
    ): Promise<TAudioBasic> {
        return this.mediaService.createAudio(data, user.id);
    }

    @Get('audios')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZAudioQueryFilter as any))
    async getManyAudios(
        @CurrentUser() user: TAuthUser | null,
        @Query() query: TAudioQueryFilter,
    ): Promise<TAudioListResponse> {
        return this.mediaService.getManyAudios({ ...query, user });
    }

    @Get('audios/:id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZAudioQueryUnique as any))
    async getOneAudio(
        @CurrentUser() user: TAuthUser | null,
        @Param('id') id: string,
    ): Promise<TAudioDetail> {
        return this.mediaService.getOneAudio({ id }, user);
    }

    @Put('audios/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateAudio))
    async updateAudio(
        @Param('id') id: string,
        @Body() data: TUpdateAudio,
    ): Promise<TAudioBasic> {
        return this.mediaService.updateAudio({ id }, data);
    }

    @Delete('audios/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZAudioQueryUnique as any))
    async deleteAudio(@Param('id') id: string): Promise<{ message: string }> {
        return this.mediaService.deleteAudio({ id });
    }

    // ==================== PHOTO ENDPOINTS ====================

    @Post('photos')
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreatePhoto))
    async createPhoto(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreatePhoto,
    ): Promise<TPhotoBasic> {
        return this.mediaService.createPhoto(data, user.id);
    }

    @Get('photos')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZPhotoQueryFilter as any))
    async getManyPhotos(
        @CurrentUser() user: TAuthUser | null,
        @Query() query: TPhotoQueryFilter,
    ): Promise<TPhotoListResponse> {
        return this.mediaService.getManyPhotos({ ...query, user });
    }

    @Get('photos/:id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZPhotoQueryUnique as any))
    async getOnePhoto(
        @CurrentUser() user: TAuthUser | null,
        @Param('id') id: string,
    ): Promise<TPhotoDetail> {
        return this.mediaService.getOnePhoto({ id }, user);
    }

    @Put('photos/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdatePhoto))
    async updatePhoto(
        @Param('id') id: string,
        @Body() data: TUpdatePhoto,
    ): Promise<TPhotoBasic> {
        return this.mediaService.updatePhoto({ id }, data);
    }

    @Delete('photos/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZPhotoQueryUnique as any))
    async deletePhoto(@Param('id') id: string): Promise<{ message: string }> {
        return this.mediaService.deletePhoto({ id });
    }

    // ==================== GALLERY ENDPOINTS ====================

    @Post('galleries')
    @HttpCode(201)
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZCreateGallery))
    async createGallery(
        @CurrentUser() user: TAuthUser,
        @Body() data: TCreateGallery,
    ): Promise<TGalleryBasic> {
        return this.mediaService.createGallery(data, user.id);
    }

    @Get('galleries')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZGalleryQueryFilter as any))
    async getManyGalleries(
        @CurrentUser() user: TAuthUser | null,
        @Query() query: TGalleryQueryFilter,
    ): Promise<TGalleryListResponse> {
        return this.mediaService.getManyGalleries({ ...query, user });
    }

    @Get('galleries/slug/:slug')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZGalleryQueryUnique as any))
    async getOneGalleryBySlug(
        @CurrentUser() user: TAuthUser | null,
        @Param('slug') slug: string,
    ): Promise<TGalleryDetail> {
        return this.mediaService.getOneGallery({ slug }, user);
    }

    @Get('galleries/:id')
    @UserAuthOptions({ safeAuth: true })
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZGalleryQueryUnique as any))
    async getOneGallery(
        @CurrentUser() user: TAuthUser | null,
        @Param('id') id: string,
    ): Promise<TGalleryDetail> {
        return this.mediaService.getOneGallery({ id }, user);
    }

    @Put('galleries/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(BodyPipe(ZUpdateGallery))
    async updateGallery(
        @Param('id') id: string,
        @Body() data: TUpdateGallery,
    ): Promise<TGalleryBasic> {
        return this.mediaService.updateGallery({ id }, data);
    }

    @Delete('galleries/:id')
    @UseGuards(UserAuthGuard)
    @UsePipes(QueryPipe(ZGalleryQueryUnique as any))
    async deleteGallery(@Param('id') id: string): Promise<{ message: string }> {
        return this.mediaService.deleteGallery({ id });
    }
}

