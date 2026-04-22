import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { DevisService } from './devis.service';
import { 
  CreateDevisDto, 
  UpdateDevisStatusDto, 
  AddNoteDto, 
  RespondDevisDto, 
  DevisQueryDto, 
  UpdateAmountDto 
} from './dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Devis')
@Controller('devis')
export class DevisController {
  constructor(private devisService: DevisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Soumettre un nouveau devis (public)' })
  async create(@Body() createDevisDto: CreateDevisDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.devisService.create(createDevisDto, ipAddress);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des devis (admin)' })
  async findAll(@Query() query: DevisQueryDto) {
    return this.devisService.findAll(query);
  }

  @Get('export')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exporter les devis en CSV' })
  async exportCsv(@Query() query: DevisQueryDto, @Res() res: Response) {
    const csv = await this.devisService.exportCsv(query);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=devis.csv');
    res.send(csv);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Détail d'un devis" })
  async findOne(@Param('id') id: string) {
    return this.devisService.findOne(id);
  }

  @Patch(':id/amount')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Mettre à jour le montant d'un devis" })
  async updateAmount(
    @Param('id') id: string,
    @Body() updateAmountDto: UpdateAmountDto,
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.devisService.updateAmount(id, updateAmountDto.amount, req.user.id, ipAddress);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Changer le statut d'un devis" })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateDevisStatusDto,
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.devisService.updateStatus(id, updateStatusDto, req.user.id, ipAddress);
  }

  @Post(':id/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter une note interne' })
  async addNote(
    @Param('id') id: string,
    @Body() addNoteDto: AddNoteDto,
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.devisService.addNote(id, addNoteDto, req.user.id, ipAddress);
  }

  @Post(':id/respond')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Répondre au client par email' })
  async respond(
    @Param('id') id: string,
    @Body() respondDevisDto: RespondDevisDto,
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.devisService.respond(id, respondDevisDto, req.user.id, ipAddress);
  }

  @Patch(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assigner un devis à un utilisateur' })
  async assign(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Request() req: any,
  ) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.devisService.assign(id, userId, req.user.id, ipAddress);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un devis (SUPER_ADMIN uniquement)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.devisService.remove(id, req.user.id, req.user.role, ipAddress);
  }
}