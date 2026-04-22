import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { CreateServiceContentDto, UpdateServiceContentDto, ReorderDto } from './dto';

@Injectable()
export class ServicesContentService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async create(createDto: CreateServiceContentDto, userId: string, ipAddress?: string) {
    // Check if slug already exists
    const existing = await this.prisma.serviceContent.findUnique({
      where: { slug: createDto.slug },
    });
    if (existing) {
      throw new BadRequestException(`Le slug "${createDto.slug}" existe déjà`);
    }

    // Get max order
    const maxOrder = await this.prisma.serviceContent.aggregate({
      _max: { order: true },
    });

    const service = await this.prisma.serviceContent.create({
      data: {
        slug: createDto.slug,
        number: createDto.number,
        icon: createDto.icon,
        titleFr: createDto.titleFr,
        titleEn: createDto.titleEn,
        titleEs: createDto.titleEs,
        titlePt: createDto.titlePt,
        titleNl: createDto.titleNl,
        titleGcr: createDto.titleGcr,
        descFr: createDto.descFr,
        descEn: createDto.descEn,
        features: createDto.features,
        image: createDto.image,
        benefit: createDto.benefit,
        order: (maxOrder._max.order || 0) + 1,
      },
    });

    await this.activityLog.log({
      action: 'CREATE',
      entity: 'Service',
      entityId: service.id,
      description: `Service "${service.titleFr}" créé`,
      userId,
      ipAddress,
    });

    return service;
  }

  async findAll(isActive?: boolean) {
    const where: any = {};
    if (isActive !== undefined) where.isActive = isActive;

    return this.prisma.serviceContent.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.serviceContent.findUnique({
      where: { id },
    });
    if (!service) {
      throw new NotFoundException(`Service ${id} non trouvé`);
    }
    return service;
  }

  async findBySlug(slug: string) {
    const service = await this.prisma.serviceContent.findUnique({
      where: { slug },
    });
    if (!service) {
      throw new NotFoundException(`Service ${slug} non trouvé`);
    }
    return service;
  }

  async update(id: string, updateDto: UpdateServiceContentDto, userId: string, ipAddress?: string) {
    const service = await this.prisma.serviceContent.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service ${id} non trouvé`);
    }

    // Check slug uniqueness if changed
    if (updateDto.slug && updateDto.slug !== service.slug) {
      const existing = await this.prisma.serviceContent.findUnique({
        where: { slug: updateDto.slug },
      });
      if (existing) {
        throw new BadRequestException(`Le slug "${updateDto.slug}" existe déjà`);
      }
    }

    const updated = await this.prisma.serviceContent.update({
      where: { id },
      data: updateDto,
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'Service',
      entityId: id,
      description: `Service "${updated.titleFr}" mis à jour`,
      userId,
      ipAddress,
    });

    return updated;
  }

  async remove(id: string, userId: string, ipAddress?: string) {
    const service = await this.prisma.serviceContent.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service ${id} non trouvé`);
    }

    await this.prisma.serviceContent.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'Service',
      entityId: id,
      description: `Service "${service.titleFr}" supprimé`,
      userId,
      ipAddress,
    });

    return { message: 'Service supprimé avec succès' };
  }

  async toggle(id: string, userId: string, ipAddress?: string) {
    const service = await this.prisma.serviceContent.findUnique({ where: { id } });
    if (!service) {
      throw new NotFoundException(`Service ${id} non trouvé`);
    }

    const updated = await this.prisma.serviceContent.update({
      where: { id },
      data: { isActive: !service.isActive },
    });

    await this.activityLog.log({
      action: 'TOGGLE',
      entity: 'Service',
      entityId: id,
      description: `Service "${updated.titleFr}" ${updated.isActive ? 'activé' : 'désactivé'}`,
      userId,
      ipAddress,
    });

    return updated;
  }

  async reorder(reorderDto: ReorderDto, userId: string, ipAddress?: string) {
    const { items } = reorderDto;

    // Update all orders
    for (let i = 0; i < items.length; i++) {
      await this.prisma.serviceContent.update({
        where: { id: items[i].id },
        data: { order: i },
      });
    }

    await this.activityLog.log({
      action: 'REORDER',
      entity: 'Service',
      description: 'Services réordonnés',
      userId,
      ipAddress,
    });

    return { message: 'Ordre mis à jour' };
  }
}