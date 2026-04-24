import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Stats')
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('dashboard')
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Stats du tableau de bord' })
  async getDashboard() {
    return this.statsService.getDashboard();
  }

  @Get('charts')
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Stats par période (charts)' })
  async getCharts(@Query('period') period: string) {
    return this.statsService.getContactStats(period || 'month');
  }

  @Get('devis')
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Stats des devis par période' })
  async getDevisStats(@Query('period') period: string) {
    return this.statsService.getContactStats(period || 'month');
  }
}