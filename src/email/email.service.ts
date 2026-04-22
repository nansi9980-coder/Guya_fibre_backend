import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;
  private fromEmail: string;
  private fromName: string;
  private isConfigured: boolean;

  constructor(private prisma: PrismaService) {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@guyafibre.com';
    this.fromName = process.env.EMAIL_FROM_NAME || 'GUYA FIBRE';

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.isConfigured = true;
      this.logger.log('Email service initialized with Resend');
    } else {
      this.isConfigured = false;
      this.logger.warn('RESEND_API_KEY not configured - emails will be logged only');
    }
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!this.isConfigured) {
      this.logger.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
      this.logger.debug(`[EMAIL MOCK] HTML: ${html.substring(0, 200)}...`);
      return { success: true, messageId: 'mock-id' };
    }

    try {
      const { data, error } = await this.resend!.emails.send({
        from: `${this.fromName} <${this.fromEmail}>`,
        to: [to],
        subject,
        html,
        text,
      });

      if (error) {
        this.logger.error(`Failed to send email: ${error.message}`);
        return { success: false, error: error.message };
      }

      this.logger.log(`Email sent successfully: ${data?.id}`);
      return { success: true, messageId: data?.id };
    } catch (error: any) {
      this.logger.error(`Email sending error: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  async sendDevisConfirmation(devis: {
    clientName: string;
    clientEmail: string;
    reference: string;
    service?: string;
  }): Promise<void> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { slug: 'devis-confirmation-client' },
    });

    if (!template) {
      this.logger.warn('Template devis-confirmation-client not found');
      return;
    }

    const variables = {
      clientName: devis.clientName,
      reference: devis.reference,
      service: devis.service || '',
      date: new Date().toLocaleDateString('fr-FR'),
    };

    const subject = this.processTemplate(template.subject, variables);
    const html = this.processTemplate(template.bodyHtml, variables);
    const text = template.bodyText ? this.processTemplate(template.bodyText, variables) : undefined;

    await this.sendEmail(devis.clientEmail, subject, html, text);
  }

  async sendDevisNotificationToAdmin(devis: {
    reference: string;
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    service?: string;
  }, adminEmail: string): Promise<void> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { slug: 'devis-notification-admin' },
    });

    if (!template) {
      this.logger.warn('Template devis-notification-admin not found');
      return;
    }

    const variables = {
      reference: devis.reference,
      clientName: devis.clientName,
      companyEmail: devis.clientEmail,
      companyPhone: devis.clientPhone || 'Non renseigné',
      service: devis.service || 'Non renseigné',
      date: new Date().toLocaleDateString('fr-FR'),
    };

    const subject = this.processTemplate(template.subject, variables);
    const html = this.processTemplate(template.bodyHtml, variables);
    const text = template.bodyText ? this.processTemplate(template.bodyText, variables) : undefined;

    await this.sendEmail(adminEmail, subject, html, text);
  }

  async sendContactConfirmation(contact: {
    name: string;
    email: string;
    reference: string;
  }): Promise<void> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { slug: 'contact-confirmation-client' },
    });

    if (!template) {
      this.logger.warn('Template contact-confirmation-client not found');
      return;
    }

    const variables = {
      name: contact.name,
      reference: contact.reference,
    };

    const subject = this.processTemplate(template.subject, variables);
    const html = this.processTemplate(template.bodyHtml, variables);
    const text = template.bodyText ? this.processTemplate(template.bodyText, variables) : undefined;

    await this.sendEmail(contact.email, subject, html, text);
  }

  async sendContactNotificationToAdmin(contact: {
    reference: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }, adminEmail: string): Promise<void> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { slug: 'contact-notification-admin' },
    });

    if (!template) {
      this.logger.warn('Template contact-notification-admin not found');
      return;
    }

    const variables = {
      reference: contact.reference,
      name: contact.name,
      email: contact.email,
      phone: contact.phone || 'Non renseigné',
      subject: contact.subject,
      message: contact.message,
    };

    const subject = this.processTemplate(template.subject, variables);
    const html = this.processTemplate(template.bodyHtml, variables);
    const text = template.bodyText ? this.processTemplate(template.bodyText, variables) : undefined;

    await this.sendEmail(adminEmail, subject, html, text);
  }

  async sendDevisResponse(devis: {
    clientName: string;
    clientEmail: string;
    reference: string;
    body: string;
  }): Promise<void> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { slug: 'devis-response' },
    });

    if (!template) {
      this.logger.warn('Template devis-response not found');
      return;
    }

    const variables = {
      clientName: devis.clientName,
      reference: devis.reference,
      body: devis.body,
    };

    const subject = this.processTemplate(template.subject, variables);
    const html = this.processTemplate(template.bodyHtml, variables);
    const text = template.bodyText ? this.processTemplate(template.bodyText, variables) : undefined;

    await this.sendEmail(devis.clientEmail, subject, html, text);
  }

  async sendTestEmail(to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return this.sendEmail(
      to,
      'Test Email - GUYA FIBRE',
      '<h1>Test Email</h1><p>This is a test email from GUYA FIBRE.</p>',
      'Test Email\n\nThis is a test email from GUYA FIBRE.'
    );
  }

  private processTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return result;
  }
}
