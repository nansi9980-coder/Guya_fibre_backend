import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { CreateRealisationDto, UpdateRealisationDto, RealisationQueryDto } from './dto';

@Injectable()
export class RealisationsService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async create(createDto: CreateRealisationDto, userId: string, ipAddress?: string) {
    const existing = await this.prisma.realisation.findUnique({
      where: { slug: createDto.slug },
    });
    if (existing) {
      throw new BadRequestException(`Le slug "${createDto.slug}" existe déjà`);
    }

    const maxOrder = await this.prisma.realisation.aggregate({
      _max: { order: true },
    });

    const realisation = await this.prisma.realisation.create({
      data: {
        slug: createDto.slug,
        titleFr: createDto.titleFr,
        titleEn: createDto.titleEn,
        location: createDto.location,
        date: createDto.date,
        scope: createDto.scope,
        descFr: createDto.descFr,
        descEn: createDto.descEn,
        tags: createDto.tags,
        images: createDto.images,
        client: createDto.client,
        isFeatured: createDto.isFeatured || false,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    await this.activityLog.log({
      action: 'CREATE',
      entity: 'Realisation',
      entityId: realisation.id,
      description: `Réalisation "${realisation.titleFr}" créée`,
      userId,
      ipAddress,
    });

    return realisation;
  }

  async findAll(query: RealisationQueryDto) {
    const { page = 1, limit = 20, isActive, isFeatured, tag, location } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;
    if (isFeatured !== undefined) where.isFeatured = isFeatured;
    if (tag) where.tags = { has: tag };
    if (location) where.location = { contains: location, mode: 'insensitive' };

    const [realisations, total] = await Promise.all([
      this.prisma.realisation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { order: 'asc' },
      }),
      this.prisma.realisation.count({ where }),
    ]);

    return {
      data: realisations,
      meta: { total, page, perPage: limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const realisation = await this.prisma.realisation.findUnique({
      where: { id },
    });
    if (!realisation) {
      throw new NotFoundException(`Réalisation ${id} non trouvée`);
    }
    return realisation;
  }

  async findBySlug(slug: string) {
    const realisation = await this.prisma.realisation.findUnique({
      where: { slug },
    });
    if (!realisation) {
      throw new NotFoundException(`Réalisation ${slug} non trouvée`);
    }
    return realisation;
  }

  async update(id: string, updateDto: UpdateRealisationDto, userId: string, ipAddress?: string) {
    const realisation = await this.prisma.realisation.findUnique({ where: { id } });
    if (!realisation) {
      throw new NotFoundException(`Réalisation ${id} non trouvée`);
    }

    if (updateDto.slug && updateDto.slug !== realisation.slug) {
      const existing = await this.prisma.realisation.findUnique({
        where: { slug: updateDto.slug },
      });
      if (existing) {
        throw new BadRequestException(`Le slug "${updateDto.slug}" existe déjà`);
      }
    }

    const updated = await this.prisma.realisation.update({
      where: { id },
      data: updateDto,
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'Realisation',
      entityId: id,
      description: `Réalisation "${updated.titleFr}" mise à jour`,
      userId,
      ipAddress,
    });

    return updated;
  }

  async remove(id: string, userId: string, ipAddress?: string) {
    const realisation = await this.prisma.realisation.findUnique({ where: { id } });
    if (!realisation) {
      throw new NotFoundException(`Réalisation ${id} non trouvée`);
    }

    await this.prisma.realisation.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'Realisation',
      entityId: id,
      description: `Réalisation "${realisation.titleFr}" supprimée`,
      userId,
      ipAddress,
    });

    return { message: 'Réalisation supprimée avec succès' };
  }

  async toggle(id: string, userId: string, ipAddress?: string) {
    const realisation = await this.prisma.realisation.findUnique({ where: { id } });
    if (!realisation) {
      throw new NotFoundException(`Réalisation ${id} non trouvée`);
    }

    const updated = await this.prisma.realisation.update({
      where: { id },
      data: { isActive: !realisation.isActive },
    });

    await this.activityLog.log({
      action: 'TOGGLE',
      entity: 'Realisation',
      entityId: id,
      description: `Réalisation "${updated.titleFr}" ${updated.isActive ? 'activée' : 'désactivée'}`,
      userId,
      ipAddress,
    });

    return updated;
  }

  async toggleFeatured(id: string, userId: string, ipAddress?: string) {
    const realisation = await this.prisma.realisation.findUnique({ where: { id } });
    if (!realisation) {
      throw new NotFoundException(`Réalisation ${id} non trouvée`);
    }

    const updated = await this.prisma.realisation.update({
      where: { id },
      data: { isFeatured: !realisation.isFeatured },
    });

    await this.activityLog.log({
      action: 'FEATURED_TOGGLE',
      entity: 'Realisation',
      entityId: id,
      description: `Réalisation "${updated.titleFr}" ${updated.isFeatured ? 'mise en avant' : 'retirée de la une'}`,
      userId,
      ipAddress,
    });

    return updated;
  }
}