import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('Stats')
@Controller('stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Stats du tableau de bord' })
  async getDashboard() {
    return this.statsService.getDashboard();
  }

  @Get('devis')
  @ApiOperation({ summary: 'Stats des devis par période' })
  async getDevisStats(@Query('period') period: string) {
    return this.statsService.getDevisStats(period || 'month');
  }
}