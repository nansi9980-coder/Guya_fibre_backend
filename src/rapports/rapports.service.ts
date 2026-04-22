import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import {
  CreateRapportDto, UpdateRapportDto, SignRapportDto, RapportQueryDto, RapportStatus,
} from './dto';

@Injectable()
export class RapportsService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  // ─── Générer la référence RPT-2026-001 ───────────────────────────────────
  private async generateReference(): Promise<string> {
    const year = new Date().getFullYear();
    const last = await this.prisma.rapport.findFirst({
      where: { reference: { startsWith: `RPT-${year}` } },
      orderBy: { reference: 'desc' },
    });
    let next = 1;
    if (last) {
      const parts = last.reference.split('-');
      next = parseInt(parts[2]) + 1;
    }
    return `RPT-${year}-${next.toString().padStart(3, '0')}`;
  }

  // ─── CREATE ──────────────────────────────────────────────────────────────
  async create(dto: CreateRapportDto, userId: string, ipAddress?: string) {
    const reference = await this.generateReference();

    const rapport = await this.prisma.rapport.create({
      data: {
        reference,
        title: dto.title,
        typeSupport: dto.typeSupport,
        status: 'DRAFT',
        authorId: userId,
        devisId: dto.devisId ?? null,
        batiment: dto.batiment,
        batimentChoix: dto.batimentChoix,
        hall: dto.hall,
        appartement: dto.appartement,
        localTechnique: dto.localTechnique,
        localTechniqueLocalisation: dto.localTechniqueLocalisation,
        photoLocalTechniqueUrl: dto.photoLocalTechniqueUrl,
        photoPavillonUrl: dto.photoPavillonUrl,
        gpsLat: dto.gpsLat,
        gpsLng: dto.gpsLng,
        notes: dto.notes,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, email: true } },
        devis: { select: { id: true, reference: true, clientName: true } },
      },
    });

    await this.activityLog.log({
      action: 'CREATE',
      entity: 'Rapport',
      entityId: rapport.id,
      description: `Rapport ${reference} créé`,
      userId,
      ipAddress,
    });

    return rapport;
  }

  // ─── FIND ALL ─────────────────────────────────────────────────────────────
  async findAll(query: RapportQueryDto) {
    const page  = query.page  || 1;
    const limit = query.limit || 20;
    const skip  = (page - 1) * limit;

    const where: any = {};
    if (query.status)   where.status   = query.status;
    if (query.authorId) where.authorId = query.authorId;
    if (query.search) {
      where.OR = [
        { title:     { contains: query.search, mode: 'insensitive' } },
        { reference: { contains: query.search, mode: 'insensitive' } },
        { batiment:  { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate)   where.createdAt.lte = new Date(query.endDate);
    }

    const [data, total] = await Promise.all([
      this.prisma.rapport.findMany({
        where, skip, take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: { select: { id: true, firstName: true, lastName: true } },
          devis:  { select: { id: true, reference: true, clientName: true } },
        },
      }),
      this.prisma.rapport.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // ─── FIND ONE ─────────────────────────────────────────────────────────────
  async findOne(id: string) {
    const rapport = await this.prisma.rapport.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, email: true } },
        devis:  { select: { id: true, reference: true, clientName: true, clientPhone: true, location: true } },
      },
    });
    if (!rapport) throw new NotFoundException(`Rapport ${id} introuvable`);
    return rapport;
  }

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  async update(id: string, dto: UpdateRapportDto, userId: string, ipAddress?: string) {
    await this.findOne(id);

    const rapport = await this.prisma.rapport.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
        devis:  { select: { id: true, reference: true, clientName: true } },
      },
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'Rapport',
      entityId: id,
      description: `Rapport ${rapport.reference} mis à jour`,
      userId,
      ipAddress,
    });

    return rapport;
  }

  // ─── SIGN ─────────────────────────────────────────────────────────────────
  async sign(id: string, dto: SignRapportDto, userId: string, ipAddress?: string) {
    const existing = await this.findOne(id);
    if (existing.status === 'ARCHIVED') {
      throw new ForbiddenException('Impossible de signer un rapport archivé');
    }

    const rapport = await this.prisma.rapport.update({
      where: { id },
      data: {
        signatureTechnicien: dto.signatureTechnicien,
        signatureClient:     dto.signatureClient ?? null,
        status:  'SIGNED',
        signedAt: new Date(),
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'Rapport',
      entityId: id,
      description: `Rapport ${rapport.reference} signé`,
      userId,
      ipAddress,
    });

    return rapport;
  }

  // ─── ARCHIVE ──────────────────────────────────────────────────────────────
  async archive(id: string, userId: string, ipAddress?: string) {
    const existing = await this.findOne(id);
    const rapport = await this.prisma.rapport.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'Rapport',
      entityId: id,
      description: `Rapport ${existing.reference} archivé`,
      userId,
      ipAddress,
    });

    return rapport;
  }

  // ─── DELETE ───────────────────────────────────────────────────────────────
  async remove(id: string, userId: string, role: string, ipAddress?: string) {
    const existing = await this.findOne(id);
    if (role !== 'SUPER_ADMIN' && existing.authorId !== userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres rapports');
    }

    await this.prisma.rapport.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'Rapport',
      entityId: id,
      description: `Rapport ${existing.reference} supprimé`,
      userId,
      ipAddress,
    });

    return { success: true };
  }

  // ─── STATS ────────────────────────────────────────────────────────────────
  async getStats() {
    const [total, draft, signed, archived, thisMonth] = await Promise.all([
      this.prisma.rapport.count(),
      this.prisma.rapport.count({ where: { status: 'DRAFT' } }),
      this.prisma.rapport.count({ where: { status: 'SIGNED' } }),
      this.prisma.rapport.count({ where: { status: 'ARCHIVED' } }),
      this.prisma.rapport.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);
    return { total, draft, signed, archived, thisMonth };
  }
}
