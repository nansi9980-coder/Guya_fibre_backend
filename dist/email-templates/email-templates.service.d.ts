import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
export declare class EmailTemplatesService {
    private prisma;
    private activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    findAll(): Promise<{
        name: string;
        id: string;
        updatedAt: Date;
        subject: string;
        slug: string;
        bodyHtml: string;
        bodyText: string | null;
        variables: string[];
        updatedById: string | null;
    }[]>;
    findOne(slug: string): Promise<{
        name: string;
        id: string;
        updatedAt: Date;
        subject: string;
        slug: string;
        bodyHtml: string;
        bodyText: string | null;
        variables: string[];
        updatedById: string | null;
    }>;
    update(slug: string, data: {
        subject?: string;
        bodyHtml?: string;
        bodyText?: string;
    }, userId: string, ipAddress?: string): Promise<{
        name: string;
        id: string;
        updatedAt: Date;
        subject: string;
        slug: string;
        bodyHtml: string;
        bodyText: string | null;
        variables: string[];
        updatedById: string | null;
    }>;
    test(slug: string, email: string): Promise<{
        message: string;
    }>;
    processTemplate(template: string, variables: Record<string, string>): string;
    sendContactNotification(contact: {
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
    }): Promise<{
        message: string;
    }>;
    sendContactConfirmation(contact: {
        reference: string;
        name: string;
        email: string;
    }): Promise<{
        message: string;
    }>;
}
