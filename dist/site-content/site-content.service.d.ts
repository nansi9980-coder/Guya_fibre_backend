import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
export declare class SiteContentService {
    private prisma;
    private activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    findOne(section: string): Promise<any>;
    findAll(): Promise<Record<string, any>>;
    update(section: string, content: any, userId: string, ipAddress?: string): Promise<{
        id: string;
        updatedAt: Date;
        updatedById: string | null;
        content: import("@prisma/client/runtime/library").JsonValue;
        section: string;
    }>;
    reset(section: string, userId: string, ipAddress?: string): Promise<{
        id: string;
        updatedAt: Date;
        updatedById: string | null;
        content: import("@prisma/client/runtime/library").JsonValue;
        section: string;
    }>;
}
