import { PrismaService } from '../prisma/prisma.service';
import { EmailTemplatesService } from '../email-templates/email-templates.service';
import { ActivityLogService } from '../logs/activity-log.service';
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
export declare class ContactService {
    private prisma;
    private emailTemplates;
    private activityLog;
    constructor(prisma: PrismaService, emailTemplates: EmailTemplatesService, activityLog: ActivityLogService);
    create(data: CreateContactDto, ipAddress?: string): Promise<{
        id: string;
        reference: string;
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
    }): Promise<{
        data: {
            name: string;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            subject: string;
            reference: string;
            phone: string | null;
            message: string;
            address: string | null;
            postalCode: string | null;
            city: string | null;
            isRead: boolean;
        }[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        reference: string;
        phone: string | null;
        message: string;
        address: string | null;
        postalCode: string | null;
        city: string | null;
        isRead: boolean;
    } | null>;
    markAsRead(id: string, userId: string, ipAddress?: string): Promise<{
        name: string;
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        subject: string;
        reference: string;
        phone: string | null;
        message: string;
        address: string | null;
        postalCode: string | null;
        city: string | null;
        isRead: boolean;
    }>;
    delete(id: string, userId: string, ipAddress?: string): Promise<void>;
}
