import { ActivityLogService } from './activity-log.service';
export declare class ActivityLogController {
    private activityLogService;
    constructor(activityLogService: ActivityLogService);
    findAll(page?: number, limit?: number, entity?: string, action?: string, userId?: string): Promise<{
        data: ({
            user: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            description: string;
            id: string;
            createdAt: Date;
            action: string;
            entity: string;
            entityId: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            ipAddress: string | null;
            userAgent: string | null;
            userId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
}
