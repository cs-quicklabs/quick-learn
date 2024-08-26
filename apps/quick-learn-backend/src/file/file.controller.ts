import {
  BadRequestException,
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/routes/auth/guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuccessResponse } from '@src/common/dto';
import multerS3 from 'multer-s3';
import { FileQueryDto } from './dto/file-query.dto';

@ApiBearerAuth()
@ApiTags('File Uploads')
@Controller({
  path: 'file',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class FileController {
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: multerS3.File,
    @Query() query: FileQueryDto,
  ): Promise<SuccessResponse> {
    if (!query.path) {
      throw new BadRequestException('Path is not provided.');
    }

    if (!file) {
      throw new BadRequestException('File is not provided.');
    }

    const location = file.location; //TODO: Send only path name and then update the expose method to return the full URL
    return new SuccessResponse('File upload sucessfully.', {
      file: location,
      type: file.mimetype,
    });
  }
}
