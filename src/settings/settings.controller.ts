import { Controller, Get, Put, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  // Routes publiques (sans auth) pour le site vitrine
  @Get('theme/public')
  @ApiOperation({ summary: 'Obtenir le thème actif (public, sans auth)' })
  async getPublicTheme() {
    return this.settingsService.findOne('theme');
  }

  @Get('company/public')
  @ApiOperation({ summary: 'Obtenir les infos société (public, sans auth)' })
  async getPublicCompany() {
    return this.settingsService.findOne('company');
  }

  @Get('site/public')
  @ApiOperation({ summary: 'Obtenir les paramètres du site (public, sans auth)' })
  async getPublicSite() {
    return this.settingsService.findOne('site');
  }

  @Get(':group')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir les paramètres d\'un groupe' })
  async findOne(@Param('group') group: string) {
    return this.settingsService.findOne(group);
  }

  @Put(':group')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour les paramètres (SUPER_ADMIN)' })
  async update(@Param('group') group: string, @Body() data: Record<string, any>, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.settingsService.update(group, data, req.user.id, ipAddress);
  }

  @Post(':group/test-smtp')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tester la configuration SMTP' })
  async testSmtp() {
    return this.settingsService.testSmtp();
  }
}
