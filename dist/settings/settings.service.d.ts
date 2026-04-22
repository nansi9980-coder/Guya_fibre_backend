import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
export declare class SettingsService {
    private prisma;
    private activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    findOne(group: string): Promise<Record<string, any>>;
    update(group: string, data: Record<string, any>, userId: string, ipAddress?: string): Promise<Record<string, any>>;
    testSmtp(): Promise<{
        success: boolean;
        message: string;
    }>;
}
