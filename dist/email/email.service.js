"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
const prisma_service_1 = require("../prisma/prisma.service");
let EmailService = EmailService_1 = class EmailService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.resend = null;
        const apiKey = process.env.RESEND_API_KEY;
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@guyafibre.com';
        this.fromName = process.env.EMAIL_FROM_NAME || 'GUYA FIBRE';
        if (apiKey) {
            this.resend = new resend_1.Resend(apiKey);
            this.isConfigured = true;
            this.logger.log('Email service initialized with Resend');
        }
        else {
            this.isConfigured = false;
            this.logger.warn('RESEND_API_KEY not configured - emails will be logged only');
        }
    }
    async sendEmail(to, subject, html, text) {
        if (!this.isConfigured) {
            this.logger.log(`[EMAIL MOCK] To: ${to}, Subject: ${subject}`);
            this.logger.debug(`[EMAIL MOCK] HTML: ${html.substring(0, 200)}...`);
            return { success: true, messageId: 'mock-id' };
        }
        try {
            const { data, error } = await this.resend.emails.send({
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
        }
        catch (error) {
            this.logger.error(`Email sending error: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    async sendDevisConfirmation(devis) {
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
    async sendDevisNotificationToAdmin(devis, adminEmail) {
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
    async sendContactConfirmation(contact) {
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
    async sendContactNotificationToAdmin(contact, adminEmail) {
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
    async sendDevisResponse(devis) {
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
    async sendTestEmail(to) {
        return this.sendEmail(to, 'Test Email - GUYA FIBRE', '<h1>Test Email</h1><p>This is a test email from GUYA FIBRE.</p>', 'Test Email\n\nThis is a test email from GUYA FIBRE.');
    }
    processTemplate(template, variables) {
        let result = template;
        for (const [key, value] of Object.entries(variables)) {
            result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
        }
        return result;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmailService);
//# sourceMappingURL=email.service.js.map