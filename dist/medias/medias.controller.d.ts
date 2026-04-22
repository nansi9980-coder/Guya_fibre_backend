import { Response } from 'express';
import { MediasService } from './medias.service';
export declare class MediasController {
    private mediasService;
    constructor(mediasService: MediasService);
    upload(file: Express.Multer.File, folder?: string, req?: any): Promise<{
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
    uploadMultiple(files: Express.Multer.File[], folder?: string, req?: any): Promise<{
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
    findAll(page?: number, limit?: number, folder?: string, search?: string): Promise<{
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
    getFile(filename: string, res: Response): Promise<void>;
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
