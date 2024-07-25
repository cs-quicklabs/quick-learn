import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class HealthCheckController {
  /** API endpoint to server health.
   * @returns a response body containing status.
   */
  @Get('health-check')
  @ApiOperation({ summary: 'Checks if the server is running or not.' })
  @HttpCode(HttpStatus.OK)
  async healthCheck(): Promise<{ status: string }> {
    return { status: 'OK' };
  }
}
