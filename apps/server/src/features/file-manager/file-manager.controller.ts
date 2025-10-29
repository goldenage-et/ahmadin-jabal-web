import { STORAGE_PROVIDER } from "@/constants/constants";
import { CurrentUser } from "@/decorators/current-user.decorator";
import { UserAuthGuard } from "@/guards/auth.guard";
import { IStorageProvider } from "@/providers/storage/storage-provider.interface";
import {
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TAuthUser } from "@repo/common";
import type { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { FileMetadataService } from "./file-metadata.service";

@ApiTags("File Manager")
@Controller("files")
export class FileManagerController {
  constructor(
    private readonly fileService: FileMetadataService,
    @Inject(STORAGE_PROVIDER) private storageProvider: IStorageProvider
  ) { }

  // ================== CATEGORY FILES ===================
  @Post("upload")
  @UseGuards(UserAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  @ApiOperation({ summary: "Upload file" })
  @ApiCookieAuth("sessionId")
  @ApiConsumes("multipart/form-data")
  @ApiResponse({
    status: 201,
    description: "File uploaded successfully",
    schema: {
      type: "object",
      properties: {
        path: {
          type: "string",
          example:
            "/files/507f1f77bcf86cd799439011-file.pdf",
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 400, description: "Bad request - Invalid file" })
  async uploadFile(
    @CurrentUser() user: TAuthUser,
    @UploadedFile() file: Express.Multer.File
  ): Promise<{ path: string }> {
    if (!file) {
      throw new Error("No file provided");
    }
    const filename = `${uuidv4()}-${file.originalname}`;
    const uploadResult = await this.storageProvider.upload(
      file,
      filename,
      file.mimetype
    );

    return {
      path: `/files/${uploadResult.filename}`,
    };
  }


  @Get(":filename")
  @ApiOperation({ summary: "Get file stream" })
  @ApiCookieAuth("sessionId")
  @ApiParam({
    name: "storeId",
    description: "Store ID",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiParam({
    name: "filename",
    description: "File name",
    example: "507f1f77bcf86cd799439011-document.pdf",
  })
  @ApiResponse({
    status: 200,
    description: "File stream",
    content: {
      "application/octet-stream": {
        schema: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "File not found" })
  async getFileStream(
    @Res() res: Response,
    @Req() req: Request,
    @Param("filename") filename: string
  ): Promise<Response> {
    return this.fileService.streamFile(req, res, filename);
  }

  @Delete(":filename")
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: "Delete file" })
  @ApiCookieAuth("sessionId")

  @ApiParam({
    name: "filename",
    description: "File name",
    example: "507f1f77bcf86cd799439011-document.pdf",
  })
  @ApiResponse({
    status: 200,
    description: "File deleted successfully",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "File deleted successfully" },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "File not found" })
  async deleteFile(
    @CurrentUser() user: TAuthUser,
    @Param("filename") filename: string
  ): Promise<{ message: string }> {
    await this.storageProvider.deleteFile(filename);
    return { message: "File deleted successfully" };
  }
}
