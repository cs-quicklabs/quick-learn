import { Controller, Get, UseGuards } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { SuccessResponse } from '@src/common/dto';
import { en } from '@src/lang/en';
import { JwtAuthGuard } from '../auth/guards';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  async getAllRoadmaps() {
    const metadata = await this.service.getContentRepositoryMetadata();
    return new SuccessResponse(en.GetContentRepositoryMetadata, metadata);
  }
}
