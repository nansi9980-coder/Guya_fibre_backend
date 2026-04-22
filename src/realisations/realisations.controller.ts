import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RealisationsService } from './realisations.service';
import { CreateRealisationDto, UpdateRealisationDto, RealisationQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Realisations')
@Controller('realisations')
export class RealisationsController {
  constructor(private realisationsService: RealisationsService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des réalisations (public)' })
  async findAll(@Query() query: RealisationQueryDto) {
    return this.realisationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une réalisation (public)' })
  async findOne(@Param('id') id: string) {
    return this.realisationsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une réalisation (EDITOR+)' })
  async create(@Body() createDto: CreateRealisationDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.realisationsService.create(createDto, req.user.id, ipAddress);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une réalisation (EDITOR+)' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateRealisationDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.realisationsService.update(id, updateDto, req.user.id, ipAddress);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une réalisation (SUPER_ADMIN)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.realisationsService.remove(id, req.user.id, ipAddress);
  }

  @Patch(':id/toggle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activer/désactiver une réalisation (EDITOR+)' })
  async toggle(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.realisationsService.toggle(id, req.user.id, ipAddress);
  }

  @Patch(':id/featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre en avant une réalisation (EDITOR+)' })
  async toggleFeatured(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.realisationsService.toggleFeatured(id, req.user.id, ipAddress);
  }
}