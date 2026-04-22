import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailTemplatesService } from '../email-templates/email-templates.service';
import { ActivityLogService } from '../logs/activity-log.service';
import * as crypto from 'crypto';

export interface CreateContactDto {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  address?: string;
  postalCode?: string;
  city?: string;
  message: string;
}

@Injectable()
export class ContactService {
  constructor(
    private prisma: PrismaService,
    private emailTemplates: EmailTemplatesService,
    private activityLog: ActivityLogService,
  ) {}

  async create(data: CreateContactDto, ipAddress?: string): Promise<{ id: string; reference: string }> {
    const reference = `CONT-${new Date().getFullYear()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

    const contact = await this.prisma.contact.create({
      data: {
        reference,
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        address: data.address,
        postalCode: data.postalCode,
        city: data.city,
        message: data.message,
      },
    });

    await this.emailTemplates.sendContactNotification(contact);

    await this.activityLog.log({
      action: 'CREATE',
      entity: 'Contact',
      entityId: contact.id,
      description: `Nouveau message de contact: ${contact.reference} - ${contact.subject}`,
      ipAddress,
    });

    return { id: contact.id, reference: contact.reference };
  }

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
            { subject: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.count({ where }),
    ]);

    return {
      data: contacts,
      meta: {
        total,
        page,
        perPage: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async markAsRead(id: string, userId: string, ipAddress?: string) {
    const contact = await this.prisma.contact.update({
      where: { id },
      data: { isRead: true },
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'Contact',
      entityId: contact.id,
      description: `Message de contact marqué comme lu: ${contact.reference}`,
      userId,
      ipAddress,
    });

    return contact;
  }

  async delete(id: string, userId: string, ipAddress?: string) {
    const contact = await this.prisma.contact.findUnique({ where: { id } });
    
    if (!contact) {
      throw new Error('Contact not found');
    }

    await this.prisma.contact.delete({ where: { id } });

    await this.activityLog.log({
      action: 'DELETE',
      entity: 'Contact',
      entityId: id,
      description: `Message de contact supprimé: ${contact.reference}`,
      userId,
      ipAddress,
    });
  }
}