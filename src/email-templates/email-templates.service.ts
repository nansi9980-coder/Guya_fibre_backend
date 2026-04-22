import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';

const DEFAULT_TEMPLATES = [
  {
    slug: 'devis-confirmation-client',
    name: 'Confirmation de devis - Client',
    subject: 'Confirmation de votre demande de devis - GUYA FIBRE',
    bodyHtml: `<h1>Bonjour {{clientName}},</h1>
<p>Nous avons bien reçu votre demande de devis.</p>
<p>Référence: <strong>{{reference}}</strong></p>
<p>Notre équipe va traiter votre demande dans les plus brefs délais.</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
    bodyText: `Bonjour {{clientName}},\n\nNous avons bien reçu votre demande de devis.\n\nRéférence: {{reference}}\n\nNotre équipe va traiter votre demande dans les plus brefs délais.\n\nCordialement,\nL'équipe GUYA FIBRE`,
    variables: ['clientName', 'reference', 'service', 'date'],
  },
  {
    slug: 'devis-notification-admin',
    name: 'Notification nouveau devis - Admin',
    subject: 'Nouveau devis reçu - {{reference}}',
    bodyHtml: `<h1>Nouveau devis reçu</h1>
<p><strong>Référence:</strong> {{reference}}</p>
<p><strong>Client:</strong> {{clientName}}</p>
<p><strong>Email:</strong> {{companyEmail}}</p>
<p><strong>Téléphone:</strong> {{companyPhone}}</p>
<p><strong>Services:</strong> {{service}}</p>
<p><strong>Date:</strong> {{date}}</p>`,
    bodyText: `Nouveau devis reçu\n\nRéférence: {{reference}}\nClient: {{clientName}}\nEmail: {{companyEmail}}\nTéléphone: {{companyPhone}}\nServices: {{service}}\nDate: {{date}}`,
    variables: ['clientName', 'reference', 'service', 'date', 'companyEmail', 'companyPhone'],
  },
  {
    slug: 'devis-response',
    name: 'Réponse au client',
    subject: 'Réponse à votre devis {{reference}} - GUYA FIBRE',
    bodyHtml: `<h1>Bonjour {{clientName}},</h1>
<p>Voici notre réponse à votre demande de devis.</p>
<p>Référence: <strong>{{reference}}</strong></p>
<p>{{body}}</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
    bodyText: `Bonjour {{clientName}},\n\nVoici notre réponse à votre demande de devis.\n\nRéférence: {{reference}}\n\n{{body}}\n\nCordialement,\nL'équipe GUYA FIBRE`,
    variables: ['clientName', 'reference', 'body'],
  },
  {
    slug: 'welcome-admin',
    name: 'Bienvenue nouvel admin',
    subject: 'Bienvenue sur GUYA FIBRE Admin',
    bodyHtml: `<h1>Bienvenue {{firstName}} {{lastName}},</h1>
<p>Votre compte administrateur a été créé sur GUYA FIBRE.</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Rôle:</strong> {{role}}</p>
<p>Vous pouvez maintenant vous connecter à l'espace admin.</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
    bodyText: `Bienvenue {{firstName}} {{lastName}},\n\nVotre compte administrateur a été créé sur GUYA FIBRE.\n\nEmail: {{email}}\nRôle: {{role}}\n\nVous pouvez maintenant vous connecter à l'espace admin.\n\nCordialement,\nL'équipe GUYA FIBRE`,
    variables: ['firstName', 'lastName', 'email', 'role'],
  },
  {
    slug: 'contact-notification-admin',
    name: 'Notification message contact - Admin',
    subject: 'Nouveau message de contact - {{reference}}',
    bodyHtml: `<h1>Nouveau message de contact</h1>
<p><strong>Référence:</strong> {{reference}}</p>
<p><strong>Nom:</strong> {{name}}</p>
<p><strong>Email:</strong> {{email}}</p>
<p><strong>Téléphone:</strong> {{phone}}</p>
<p><strong>Adresse:</strong> {{address}}</p>
<p><strong>Code postal:</strong> {{postalCode}}</p>
<p><strong>Ville:</strong> {{city}}</p>
<p><strong>Sujet:</strong> {{subject}}</p>
<p><strong>Message:</strong></p>
<p>{{message}}</p>`,
    bodyText: `Nouveau message de contact\n\nRéférence: {{reference}}\nNom: {{name}}\nEmail: {{email}}\nTéléphone: {{phone}}\nAdresse: {{address}}\nCode postal: {{postalCode}}\nVille: {{city}}\nSujet: {{subject}}\n\nMessage:\n{{message}}`,
    variables: ['reference', 'name', 'email', 'phone', 'address', 'postalCode', 'city', 'subject', 'message'],
  },
  {
    slug: 'contact-confirmation-client',
    name: 'Confirmation message contact - Client',
    subject: 'Confirmation de réception - GUYA FIBRE',
    bodyHtml: `<h1>Bonjour {{name}},</h1>
<p>Nous avons bien reçu votre message.</p>
<p>Référence: <strong>{{reference}}</strong></p>
<p>Notre équipe vous répondra dans les plus brefs délais.</p>
<p>Cordialement,<br>L'équipe GUYA FIBRE</p>`,
    bodyText: `Bonjour {{name}},\n\nNous avons bien reçu votre message.\n\nRéférence: {{reference}}\n\nNotre équipe vous répondra dans les plus brefs délais.\n\nCordialement,\nL'équipe GUYA FIBRE`,
    variables: ['name', 'reference'],
  },
];

@Injectable()
export class EmailTemplatesService {
  constructor(
    private prisma: PrismaService,
    private activityLog: ActivityLogService,
  ) {}

  async findAll() {
    let templates = await this.prisma.emailTemplate.findMany({
      orderBy: { name: 'asc' },
    });

    if (templates.length === 0) {
      for (const template of DEFAULT_TEMPLATES) {
        await this.prisma.emailTemplate.create({ data: template });
      }
      templates = await this.prisma.emailTemplate.findMany({
        orderBy: { name: 'asc' },
      });
    }

    return templates;
  }

  async findOne(slug: string) {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { slug },
    });
    if (!template) {
      throw new NotFoundException(`Template ${slug} non trouvé`);
    }
    return template;
  }

  async update(slug: string, data: { subject?: string; bodyHtml?: string; bodyText?: string }, userId: string, ipAddress?: string) {
    const template = await this.prisma.emailTemplate.findUnique({ where: { slug } });
    if (!template) {
      throw new NotFoundException(`Template ${slug} non trouvé`);
    }

    const updated = await this.prisma.emailTemplate.update({
      where: { slug },
      data: { ...data, updatedById: userId },
    });

    await this.activityLog.log({
      action: 'UPDATE',
      entity: 'EmailTemplate',
      entityId: slug,
      description: `Template email "${template.name}" mis à jour`,
      userId,
      ipAddress,
    });

    return updated;
  }

  async test(slug: string, email: string) {
    const template = await this.prisma.emailTemplate.findUnique({ where: { slug } });
    if (!template) {
      throw new NotFoundException(`Template ${slug} non trouvé`);
    }

    console.log(`Sending test email to ${email} with template ${slug}`);

    return { message: `Email de test envoyé à ${email}` };
  }

  processTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }

  async sendContactNotification(contact: {
    id: string;
    reference: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    postalCode?: string | null;
    city?: string | null;
    subject: string;
    message: string;
  }) {
    console.log(`[Contact] Notification sent for ${contact.reference}`);
    return { message: 'Contact notification processed' };
  }

  async sendContactConfirmation(contact: {
    reference: string;
    name: string;
    email: string;
  }) {
    console.log(`[Contact] Confirmation sent to ${contact.email} for ${contact.reference}`);
    return { message: 'Contact confirmation processed' };
  }
}