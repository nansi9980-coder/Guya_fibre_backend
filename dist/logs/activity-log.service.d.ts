import { PrismaService } from '../prisma/prisma.service';
export interface LogInput {
    action: string;
    entity: string;
    entityId?: string;
    description: string;
    metadata?: any;
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
}
export declare class ActivityLogService {
    private prisma;
    constructor(prisma: PrismaService);
    log(input: LogInput): Promise<{
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
    }>;
    findAll(query: {
        page?: number;
        limit?: number;
        entity?: string;
        action?: string;
        userId?: string;
    }): Promise<{
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
