import { PrismaService } from '../prisma/prisma.service';
export declare class EmailService {
    private prisma;
    private readonly logger;
    private resend;
    private fromEmail;
    private fromName;
    private isConfigured;
    constructor(prisma: PrismaService);
    sendEmail(to: string, subject: string, html: string, text?: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendDevisConfirmation(devis: {
        clientName: string;
        clientEmail: string;
        reference: string;
        service?: string;
    }): Promise<void>;
    sendDevisNotificationToAdmin(devis: {
        reference: string;
        clientName: string;
        clientEmail: string;
        clientPhone?: string;
        service?: string;
    }, adminEmail: string): Promise<void>;
    sendContactConfirmation(contact: {
        name: string;
        email: string;
        reference: string;
    }): Promise<void>;
    sendContactNotificationToAdmin(contact: {
        reference: string;
        name: string;
        email: string;
        phone?: string;
        subject: string;
        message: string;
    }, adminEmail: string): Promise<void>;
    sendDevisResponse(devis: {
        clientName: string;
        clientEmail: string;
        reference: string;
        body: string;
    }): Promise<void>;
    sendTestEmail(to: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    private processTemplate;
}
