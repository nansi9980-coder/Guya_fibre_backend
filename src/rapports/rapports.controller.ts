import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, UseGuards, Request,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RapportsService } from './rapports.service';
import {
  CreateRapportDto, UpdateRapportDto, SignRapportDto, RapportQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Rapports')
@Controller('rapports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RapportsController {
  constructor(private rapportsService: RapportsService) {}

  // ─── STATS ────────────────────────────────────────────────────────────────
  @Get('stats')
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Statistiques des rapports' })
  async getStats() {
    return this.rapportsService.getStats();
  }

  // ─── CREATE ───────────────────────────────────────────────────────────────
  @Post()
  @Roles('SUPER_ADMIN', 'EDITOR')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un rapport (EDITOR+)' })
  async create(@Body() dto: CreateRapportDto, @Request() req: any) {
    const ip = req.ip || req.connection?.remoteAddress;
    return this.rapportsService.create(dto, req.user.id, ip);
  }

  // ─── LIST ─────────────────────────────────────────────────────────────────
  @Get()
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Liste des rapports' })
  async findAll(@Query() query: RapportQueryDto) {
    return this.rapportsService.findAll(query);
  }

  // ─── ONE ──────────────────────────────────────────────────────────────────
  @Get(':id')
  @Roles('SUPER_ADMIN', 'EDITOR', 'VIEWER')
  @ApiOperation({ summary: 'Détail d\'un rapport' })
  async findOne(@Param('id') id: string) {
    return this.rapportsService.findOne(id);
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  @Patch(':id')
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Mettre à jour un rapport (EDITOR+)' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateRapportDto,
    @Request() req: any,
  ) {
    const ip = req.ip || req.connection?.remoteAddress;
    return this.rapportsService.update(id, dto, req.user.id, ip);
  }

  // ─── SIGN ─────────────────────────────────────────────────────────────────
  @Patch(':id/sign')
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Signer un rapport (EDITOR+)' })
  async sign(
    @Param('id') id: string,
    @Body() dto: SignRapportDto,
    @Request() req: any,
  ) {
    const ip = req.ip || req.connection?.remoteAddress;
    return this.rapportsService.sign(id, dto, req.user.id, ip);
  }

  // ─── ARCHIVE ──────────────────────────────────────────────────────────────
  @Patch(':id/archive')
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Archiver un rapport' })
  async archive(@Param('id') id: string, @Request() req: any) {
    const ip = req.ip || req.connection?.remoteAddress;
    return this.rapportsService.archive(id, req.user.id, ip);
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  @Delete(':id')
  @Roles('SUPER_ADMIN', 'EDITOR')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un rapport' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const ip = req.ip || req.connection?.remoteAddress;
    return this.rapportsService.remove(id, req.user.id, req.user.role, ip);
  }
}
