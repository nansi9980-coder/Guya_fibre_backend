import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async create(createDto: CreateUserDto, userId: string, ipAddress?: string) {
    // Check if email already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: createDto.email },
    });
    if (existing) {
      throw new BadRequestException(`L'email "${createDto.email}" est déjà utilisé`);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: createDto.email,
        password: hashedPassword,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        role: createDto.role || 'EDITOR',
      },
    });

    await this.activityLog.log({
      action: 'CREATE',
      entity: 'User',
      entityId: user.id,
      description: `Utilisateur "${user.email}" créé`,
      userId,
      ipAddress,
    });

    const { password: _, refreshToken: __, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(query: UserQueryDto) {
    const { page = 1, limit = 20, role, isActive, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, perPage: limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }
    return user;
  }

  async update(id: string, updateDto: UpdateUserDto, userId: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    // Check email uniqueness if changed
    if (updateDto.email && updateDto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: updateDto.email },
      });
      if (existing) {
        throw new BadRequestException(`L'email "${updateDto.email}" est déjà utilisé`);
      }
    }

    const updateData: any = {};
    if (updateDto.email) updateData.email = updateDto.email;
    if (updateDto.firstName) updateData.firstName = updateDto.firstName;
    if (updateDto.lastName) updateData.lastName = updateDto.lastName;
    if (updateDto.role) updateData.role = updateDto.role;
    if (updateDto.isActive !== undefined) updateData.isActive = updateDto.isActive;
    if (updateDto.password) {
      updateData.password = await bcrypt.hash(updateDto.password, 12);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      description: `Utilisateur "${updated.email}" mis à jour`,
      userId,
      ipAddress,
    });

    const { password: _, refreshToken: __, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  async remove(id: string, userId: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Utilisateur ${id} non trouvé`);
    }

    // Prevent self-deletion
    if (id === userId) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte');
    }

    await this.prisma.user.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      description: `Utilisateur "${user.email}" supprimé`,
      userId,
      ipAddress,
    });

    return { message: 'Utilisateur supprimé avec succès' };
  }
}