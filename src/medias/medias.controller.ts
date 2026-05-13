import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { MediasService } from './medias.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Medias')
@Controller('medias')
export class MediasController {
  constructor(private mediasService: MediasService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload un fichier sur Cloudinary (EDITOR+)' })
  async upload(
    @UploadedFile() file: any,
    @Body('folder') folder?: string,
    @Request() req?: any,
  ) {
    const ipAddress = req?.ip || req?.connection?.remoteAddress;
    return this.mediasService.upload(file, folder || 'general', req.user.id, ipAddress);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des médias (admin)' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('folder') folder?: string,
    @Query('search') search?: string,
  ) {
    return this.mediasService.findAll({ page, limit, folder, search });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détail d\'un média' })
  async findOne(@Param('id') id: string) {
    return this.mediasService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un média (SUPER_ADMIN)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.mediasService.remove(id, req.user.id, req.user.role, ipAddress);
  }
}