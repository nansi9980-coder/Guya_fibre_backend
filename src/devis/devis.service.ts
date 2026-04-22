import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { EmailService } from '../email/email.service';
import { CreateDevisDto, UpdateDevisStatusDto, AddNoteDto, RespondDevisDto, DevisQueryDto, UpdateAmountDto } from './dto';

@Injectable()
export class DevisService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
    private emailService: EmailService,
  ) {}

  async create(createDevisDto: CreateDevisDto, ipAddress?: string) {
    const year = new Date().getFullYear();
    const lastDevis = await this.prisma.devis.findFirst({
      where: { reference: { startsWith: `DEV-${year}` } },
      orderBy: { reference: 'desc' },
    });

    let nextNumber = 1;
    if (lastDevis) {
      const lastNumber = parseInt(lastDevis.reference.split('-')[2]);
      nextNumber = lastNumber + 1;
    }

    const reference = `DEV-${year}-${nextNumber.toString().padStart(3, '0')}`;

    const devis = await this.prisma.devis.create({
      data: {
        reference,
        clientName: createDevisDto.clientName,
        clientEmail: createDevisDto.clientEmail,
        clientPhone: createDevisDto.clientPhone,
        company: createDevisDto.company,
        services: createDevisDto.services,
        location: createDevisDto.location,
        address: createDevisDto.address,
        postalCode: createDevisDto.postalCode,
        description: createDevisDto.description,
        urgency: createDevisDto.urgency || 'NORMAL',
      },
    });

    await this.activityLog.log({
      action: 'CREATE',
      entity: 'Devis',
      entityId: devis.id,
      description: `Nouveau devis ${reference} créé`,
      ipAddress,
    });

    await this.emailService.sendDevisConfirmation({
      clientName: devis.clientName,
      clientEmail: devis.clientEmail,
      reference: devis.reference,
      service: devis.services.join(', '),
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'contact@guyafibre.com';
    await this.emailService.sendDevisNotificationToAdmin({
      reference: devis.reference,
      clientName: devis.clientName,
      clientEmail: devis.clientEmail,
      clientPhone: devis.clientPhone,
      service: devis.services.join(', '),
    }, adminEmail);

    return devis;
  }

  async findAll(query: DevisQueryDto) {
    const { page = 1, limit = 20, status, location, urgency, search, startDate, endDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status.toUpperCase();
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (urgency) where.urgency = urgency.toUpperCase();
    if (search) {
      where.OR = [
        { reference: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { clientEmail: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [devis, total] = await Promise.all([
      this.prisma.devis.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          _count: { select: { notes: true, responses: true } },
        },
      }),
      this.prisma.devis.count({ where }),
    ]);

    return {
      data: devis,
      meta: { total, page, perPage: limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const devis = await this.prisma.devis.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, firstName: true, lastName: true } } },
        },
        responses: {
          orderBy: { sentAt: 'desc' },
          include: { sentBy: { select: { id: true, firstName: true, lastName: true } } },
        },
      },
    });

    if (!devis) throw new NotFoundException(`Le devis ${id} n'existe pas`);

    return devis;
  }

  // ==================== NOUVELLE MÉTHODE POUR LE MONTANT ====================
  async updateAmount(id: string, amount: number | undefined, userId: string, ipAddress?: string) {
    const devis = await this.prisma.devis.findUnique({ where: { id } });

    if (!devis) {
      throw new NotFoundException(`Le devis ${id} n'existe pas`);
    }

    const updated = await this.prisma.devis.update({
      where: { id },
      data: { amount: amount ?? null },
    });

    await this.activityLog.log({
      action: 'AMOUNT_UPDATE',
      entity: 'Devis',
      entityId: id,
      description: `Montant mis à jour pour le devis ${devis.reference} : ${amount ? amount + ' €' : 'Non défini'}`,
      metadata: { oldAmount: devis.amount, newAmount: amount },
      userId,
      ipAddress,
    });

    return updated;
  }
  // ======================================================================

  async updateStatus(id: string, updateStatusDto: UpdateDevisStatusDto, userId: string, ipAddress?: string) {
    const devis = await this.prisma.devis.findUnique({ where: { id } });

    if (!devis) {
      throw new NotFoundException(`Le devis ${id} n'existe pas`);
    }

    const updated = await this.prisma.devis.update({
      where: { id },
      data: {
        status: updateStatusDto.status,
        amount: updateStatusDto.amount ?? devis.amount ?? null,
      },
    });

    await this.activityLog.log({
      action: 'STATUS_CHANGE',
      entity: 'Devis',
      entityId: id,
      description: `Devis ${devis.reference} — statut changé vers ${updateStatusDto.status}`,
      metadata: { oldStatus: devis.status, newStatus: updateStatusDto.status },
      userId,
      ipAddress,
    });

    return updated;
  }

  async addNote(id: string, addNoteDto: AddNoteDto, userId: string, ipAddress?: string) {
    const devis = await this.prisma.devis.findUnique({ where: { id } });

    if (!devis) throw new NotFoundException(`Le devis ${id} n'existe pas`);

    const note = await this.prisma.devisNote.create({
      data: {
        content: addNoteDto.content,
        devisId: id,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await this.activityLog.log({
      action: 'NOTE_ADD',
      entity: 'Devis',
      entityId: id,
      description: `Note ajoutée au devis ${devis.reference}`,
      userId,
      ipAddress,
    });

    return note;
  }

  async respond(id: string, respondDevisDto: RespondDevisDto, userId: string, ipAddress?: string) {
    const devis = await this.prisma.devis.findUnique({ where: { id } });

    if (!devis) throw new NotFoundException(`Le devis ${id} n'existe pas`);

    const response = await this.prisma.devisResponse.create({
      data: {
        subject: respondDevisDto.subject,
        body: respondDevisDto.body,
        devisId: id,
        sentById: userId,
      },
      include: {
        sentBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    await this.emailService.sendDevisResponse({
      clientName: devis.clientName,
      clientEmail: devis.clientEmail,
      reference: devis.reference,
      body: respondDevisDto.body,
    });

    await this.activityLog.log({
      action: 'RESPONSE_SENT',
      entity: 'Devis',
      entityId: id,
      description: `Réponse envoyée au client pour ${devis.reference}`,
      userId,
      ipAddress,
    });

    return response;
  }

  async exportCsv(query: DevisQueryDto) {
    const { status, location, urgency, startDate, endDate } = query;

    const where: any = {};
    if (status) where.status = status.toUpperCase();
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (urgency) where.urgency = urgency.toUpperCase();
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const devis = await this.prisma.devis.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    const csv = [
      'Référence,Client,Email,Téléphone,Services,Lieu,Statut,Urgence,Montant,Date',
      ...devis.map(d =>
        `${d.reference},"${d.clientName}","${d.clientEmail}","${d.clientPhone}","${d.services.join(';')}","${d.location}",${d.status},${d.urgency},${d.amount || ''},${d.createdAt.toISOString()}`
      ),
    ].join('\n');

    return csv;
  }

  async assign(id: string, assignedToId: string, userId: string, ipAddress?: string) {
    const devis = await this.prisma.devis.findUnique({ where: { id } });
    if (!devis) throw new NotFoundException(`Le devis ${id} n'existe pas`);

    const user = await this.prisma.user.findUnique({ where: { id: assignedToId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const updated = await this.prisma.devis.update({
      where: { id },
      data: { assignedToId },
    });

    await this.activityLog.log({
      action: 'ASSIGN',
      entity: 'Devis',
      entityId: id,
      description: `Devis ${devis.reference} assigné à ${user.firstName} ${user.lastName}`,
      metadata: { assignedToId },
      userId,
      ipAddress,
    });

    return updated;
  }

  async remove(id: string, userId: string, userRole: string, ipAddress?: string) {
    if (userRole !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Seuls les SUPER_ADMIN peuvent supprimer des devis');
    }

    const devis = await this.prisma.devis.findUnique({ where: { id } });
    if (!devis) throw new NotFoundException(`Le devis ${id} n'existe pas`);

    await this.prisma.devis.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'Devis',
      entityId: id,
      description: `Devis ${devis.reference} supprimé`,
      userId,
      ipAddress,
    });

    return { message: 'Devis supprimé avec succès' };
  }
}