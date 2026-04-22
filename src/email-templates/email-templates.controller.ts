import { Controller, Get, Put, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmailTemplatesService } from './email-templates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Email Templates')
@Controller('email-templates')
export class EmailTemplatesController {
  constructor(private emailTemplatesService: EmailTemplatesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des templates d\'email (admin)' })
  async findAll() {
    return this.emailTemplatesService.findAll();
  }

  @Get(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détail d\'un template' })
  async findOne(@Param('slug') slug: string) {
    return this.emailTemplatesService.findOne(slug);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un template (EDITOR+)' })
  async update(
    @Param('slug') slug: string,
    @Body() data: { subject?: string; bodyHtml?: string; bodyText?: string },
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.emailTemplatesService.update(slug, data, req.user.id, ipAddress);
  }

  @Post('test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Envoyer un email de test' })
  async test(@Body() body: { slug: string; email: string }) {
    return this.emailTemplatesService.test(body.slug, body.email);
  }
}