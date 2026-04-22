import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesContentService } from './services-content.service';
import { CreateServiceContentDto, UpdateServiceContentDto, ReorderDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Services Content')
@Controller('services-content')
export class ServicesContentController {
  constructor(private servicesContentService: ServicesContentService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des services (public)' })
  async findAll(@Query('isActive') isActive?: boolean) {
    return this.servicesContentService.findAll(isActive);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un service (public)' })
  async findOne(@Param('id') id: string) {
    return this.servicesContentService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un service (EDITOR+)' })
  async create(@Body() createDto: CreateServiceContentDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.servicesContentService.create(createDto, req.user.id, ipAddress);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un service (EDITOR+)' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateServiceContentDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.servicesContentService.update(id, updateDto, req.user.id, ipAddress);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un service (SUPER_ADMIN)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.servicesContentService.remove(id, req.user.id, ipAddress);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activer/désactiver un service (EDITOR+)' })
  async toggle(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.servicesContentService.toggle(id, req.user.id, ipAddress);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Réordonner les services (EDITOR+)' })
  async reorder(@Body() reorderDto: ReorderDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.servicesContentService.reorder(reorderDto, req.user.id, ipAddress);
  }
}