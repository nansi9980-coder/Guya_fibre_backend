import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { CreateRapportDto, UpdateRapportDto, SignRapportDto, RapportQueryDto } from './dto';
export declare class RapportsService {
    private prisma;
    private activityLog;
    constructor(prisma: PrismaService, activityLog: ActivityLogService);
    private generateReference;
    create(dto: CreateRapportDto, userId: string, ipAddress?: string): Promise<{
        devis: {
            id: string;
            clientName: string;
            reference: string;
        } | null;
        author: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: import(".prisma/client").$Enums.RapportStatus;
        notes: string | null;
        devisId: string | null;
        authorId: string;
        typeSupport: import(".prisma/client").$Enums.SupportType | null;
        batiment: string | null;
        batimentChoix: string | null;
        hall: string | null;
        appartement: string | null;
        localTechnique: string | null;
        localTechniqueLocalisation: string | null;
        photoLocalTechniqueUrl: string | null;
        photoPavillonUrl: string | null;
        gpsLat: number | null;
        gpsLng: number | null;
        signatureTechnicien: string | null;
        signatureClient: string | null;
        signedAt: Date | null;
    }>;
    findAll(query: RapportQueryDto): Promise<{
        data: ({
            devis: {
                id: string;
                clientName: string;
                reference: string;
            } | null;
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            reference: string;
            status: import(".prisma/client").$Enums.RapportStatus;
            notes: string | null;
            devisId: string | null;
            authorId: string;
            typeSupport: import(".prisma/client").$Enums.SupportType | null;
            batiment: string | null;
            batimentChoix: string | null;
            hall: string | null;
            appartement: string | null;
            localTechnique: string | null;
            localTechniqueLocalisation: string | null;
            photoLocalTechniqueUrl: string | null;
            photoPavillonUrl: string | null;
            gpsLat: number | null;
            gpsLng: number | null;
            signatureTechnicien: string | null;
            signatureClient: string | null;
            signedAt: Date | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<{
        devis: {
            id: string;
            clientName: string;
            reference: string;
            clientPhone: string;
            location: string;
        } | null;
        author: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: import(".prisma/client").$Enums.RapportStatus;
        notes: string | null;
        devisId: string | null;
        authorId: string;
        typeSupport: import(".prisma/client").$Enums.SupportType | null;
        batiment: string | null;
        batimentChoix: string | null;
        hall: string | null;
        appartement: string | null;
        localTechnique: string | null;
        localTechniqueLocalisation: string | null;
        photoLocalTechniqueUrl: string | null;
        photoPavillonUrl: string | null;
        gpsLat: number | null;
        gpsLng: number | null;
        signatureTechnicien: string | null;
        signatureClient: string | null;
        signedAt: Date | null;
    }>;
    update(id: string, dto: UpdateRapportDto, userId: string, ipAddress?: string): Promise<{
        devis: {
            id: string;
            clientName: string;
            reference: string;
        } | null;
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: import(".prisma/client").$Enums.RapportStatus;
        notes: string | null;
        devisId: string | null;
        authorId: string;
        typeSupport: import(".prisma/client").$Enums.SupportType | null;
        batiment: string | null;
        batimentChoix: string | null;
        hall: string | null;
        appartement: string | null;
        localTechnique: string | null;
        localTechniqueLocalisation: string | null;
        photoLocalTechniqueUrl: string | null;
        photoPavillonUrl: string | null;
        gpsLat: number | null;
        gpsLng: number | null;
        signatureTechnicien: string | null;
        signatureClient: string | null;
        signedAt: Date | null;
    }>;
    sign(id: string, dto: SignRapportDto, userId: string, ipAddress?: string): Promise<{
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: import(".prisma/client").$Enums.RapportStatus;
        notes: string | null;
        devisId: string | null;
        authorId: string;
        typeSupport: import(".prisma/client").$Enums.SupportType | null;
        batiment: string | null;
        batimentChoix: string | null;
        hall: string | null;
        appartement: string | null;
        localTechnique: string | null;
        localTechniqueLocalisation: string | null;
        photoLocalTechniqueUrl: string | null;
        photoPavillonUrl: string | null;
        gpsLat: number | null;
        gpsLng: number | null;
        signatureTechnicien: string | null;
        signatureClient: string | null;
        signedAt: Date | null;
    }>;
    archive(id: string, userId: string, ipAddress?: string): Promise<{
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        status: import(".prisma/client").$Enums.RapportStatus;
        notes: string | null;
        devisId: string | null;
        authorId: string;
        typeSupport: import(".prisma/client").$Enums.SupportType | null;
        batiment: string | null;
        batimentChoix: string | null;
        hall: string | null;
        appartement: string | null;
        localTechnique: string | null;
        localTechniqueLocalisation: string | null;
        photoLocalTechniqueUrl: string | null;
        photoPavillonUrl: string | null;
        gpsLat: number | null;
        gpsLng: number | null;
        signatureTechnicien: string | null;
        signatureClient: string | null;
        signedAt: Date | null;
    }>;
    remove(id: string, userId: string, role: string, ipAddress?: string): Promise<{
        success: boolean;
    }>;
    getStats(): Promise<{
        total: number;
        draft: number;
        signed: number;
        archived: number;
        thisMonth: number;
    }>;
}
