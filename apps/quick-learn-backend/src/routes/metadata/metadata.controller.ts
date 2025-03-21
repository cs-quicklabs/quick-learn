import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { JwtAuthGuard } from '../auth/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@src/common/decorators/current-user.decorators';
import { UserEntity } from '@src/entities';

@ApiTags('Metadata')
@Controller({
  path: 'metadata',
  version: '1',
})
@UseGuards(JwtAuthGuard)
export class MetadataController {
  constructor(private readonly service: MetadataService) {}

  @Get('content-repository')
  @ApiOperation({ summary: 'Get content repository metadata' })
  async getAllRoadmaps(@CurrentUser() user: UserEntity) {
    const metadata = await this.service.getContentRepositoryMetadata(user);
    return new SuccessResponse(en.GetContentRepositoryMetadata, metadata);
  }
  @Get('system-preferences')
  @ApiOperation({
    summary: 'Get system prefrences like Unapproved Lesson count',
  })
  async getLessonMetaData(@CurrentUser() user: UserEntity) {
    const metadata = await this.service.getLessonMetaData(user);
    return new SuccessResponse(en.GetContentMetadata, metadata);
  }
}
