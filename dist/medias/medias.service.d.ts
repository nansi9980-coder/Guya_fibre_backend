import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import * as fs from 'fs';
export declare class MediasService {
    private config;
    private prisma;
    private activityLog;
    private uploadDir;
    constructor(config: ConfigService, prisma: PrismaService, activityLog: ActivityLogService);
    upload(file: any, folder: string | undefined, userId: string, ipAddress?: string): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string | null;
        folder: string;
        uploadedById: string;
    }>;
    uploadMultiple(files: any[], folder: string | undefined, userId: string, ipAddress?: string): Promise<{
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string | null;
        folder: string;
        uploadedById: string;
    }[]>;
    findAll(query: {
        page?: number;
        limit?: number;
        folder?: string;
        search?: string;
        mimeType?: string;
    }): Promise<{
        data: ({
            uploadedBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            filename: string;
            originalName: string;
            mimeType: string;
            size: number;
            url: string;
            thumbnailUrl: string | null;
            folder: string;
            uploadedById: string;
        })[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        uploadedBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        url: string;
        thumbnailUrl: string | null;
        folder: string;
        uploadedById: string;
    }>;
    getFile(filename: string): Promise<{
        stream: fs.ReadStream;
        mimeType: string;
    }>;
    remove(id: string, userId: string, userRole: string, ipAddress?: string): Promise<{
        message: string;
    }>;
}
