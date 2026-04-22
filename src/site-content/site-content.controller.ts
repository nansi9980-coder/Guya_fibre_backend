import { Controller, Get, Put, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SiteContentService } from './site-content.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Site Content')
@Controller('site-content')
export class SiteContentController {
  constructor(private siteContentService: SiteContentService) {}

  @Get()
  @ApiOperation({ summary: 'Tout le contenu du site (admin)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  async findAll() {
    return this.siteContentService.findAll();
  }

  @Get(':section')
  @ApiOperation({ summary: 'Contenu d\'une section (public)' })
  async findOne(@Param('section') section: string) {
    return this.siteContentService.findOne(section);
  }

  @Put(':section')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une section (EDITOR+)' })
  async update(@Param('section') section: string, @Body() content: any, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.siteContentService.update(section, content, req.user.id, ipAddress);
  }

  @Post(':section/reset')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Réinitialiser une section (SUPER_ADMIN)' })
  async reset(@Param('section') section: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.siteContentService.reset(section, req.user.id, ipAddress);
  }
}