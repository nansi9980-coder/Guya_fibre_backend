import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Créer un utilisateur (SUPER_ADMIN)' })
  async create(@Body() createDto: CreateUserDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.usersService.create(createDto, req.user.id, ipAddress);
  }

  @Get()
  @Roles('SUPER_ADMIN', 'EDITOR')
  @ApiOperation({ summary: 'Liste des utilisateurs (EDITOR+)' })
  async findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'un utilisateur' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Mettre à jour un utilisateur (SUPER_ADMIN)' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateUserDto, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.usersService.update(id, updateDto, req.user.id, ipAddress);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Supprimer un utilisateur (SUPER_ADMIN)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const ipAddress = req.ip || req.connection?.remoteAddress;
    return this.usersService.remove(id, req.user.id, ipAddress);
  }
}