import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService, CreateContactDto } from './contact.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Soumettre un message de contact (public)' })
  async create(@Body() createContactDto: CreateContactDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.contactService.create(createContactDto, ipAddress);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR', 'VIEWER', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des messages de contact (admin)' })
  async findAll(@Query() query: { page?: number; limit?: number; search?: string }) {
    return this.contactService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR', 'VIEWER', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détail d\'un message de contact' })
  async findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Patch(':id/read')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR', 'VIEWER', 'SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer un message comme lu' })
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.contactService.markAsRead(id, req.user.id, ipAddress);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un message de contact (SUPER_ADMIN)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.contactService.delete(id, req.user.id, ipAddress);
  }
}
