import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogService } from '../logs/activity-log.service';
import { EmailService } from '../email/email.service';
import { CreateDevisDto, UpdateDevisStatusDto, AddNoteDto, RespondDevisDto, DevisQueryDto } from './dto';
export declare class DevisService {
    private prisma;
    private activityLog;
    private emailService;
    constructor(prisma: PrismaService, activityLog: ActivityLogService, emailService: EmailService);
    create(createDevisDto: CreateDevisDto, ipAddress?: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        reference: string;
        amount: number | null;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        postalCode: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        assignedToId: string | null;
    }>;
    findAll(query: DevisQueryDto): Promise<{
        data: ({
            _count: {
                responses: number;
                notes: number;
            };
            assignedTo: {
                email: string;
                id: string;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            description: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            clientName: string;
            reference: string;
            amount: number | null;
            clientEmail: string;
            clientPhone: string;
            company: string | null;
            services: string[];
            location: string;
            address: string | null;
            postalCode: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            status: import(".prisma/client").$Enums.DevisStatus;
            assignedToId: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            perPage: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        responses: ({
            sentBy: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            subject: string;
            body: string;
            sentAt: Date;
            devisId: string;
            sentById: string;
        })[];
        notes: ({
            author: {
                id: string;
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            content: string;
            devisId: string;
            authorId: string;
        })[];
        assignedTo: {
            email: string;
            id: string;
            firstName: string;
            lastName: string;
        } | null;
    } & {
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        reference: string;
        amount: number | null;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        postalCode: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        assignedToId: string | null;
    }>;
    updateAmount(id: string, amount: number | undefined, userId: string, ipAddress?: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        reference: string;
        amount: number | null;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        postalCode: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        assignedToId: string | null;
    }>;
    updateStatus(id: string, updateStatusDto: UpdateDevisStatusDto, userId: string, ipAddress?: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        reference: string;
        amount: number | null;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        postalCode: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        assignedToId: string | null;
    }>;
    addNote(id: string, addNoteDto: AddNoteDto, userId: string, ipAddress?: string): Promise<{
        author: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        content: string;
        devisId: string;
        authorId: string;
    }>;
    respond(id: string, respondDevisDto: RespondDevisDto, userId: string, ipAddress?: string): Promise<{
        sentBy: {
            id: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        subject: string;
        body: string;
        sentAt: Date;
        devisId: string;
        sentById: string;
    }>;
    exportCsv(query: DevisQueryDto): Promise<string>;
    assign(id: string, assignedToId: string, userId: string, ipAddress?: string): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        clientName: string;
        reference: string;
        amount: number | null;
        clientEmail: string;
        clientPhone: string;
        company: string | null;
        services: string[];
        location: string;
        address: string | null;
        postalCode: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        status: import(".prisma/client").$Enums.DevisStatus;
        assignedToId: string | null;
    }>;
    remove(id: string, userId: string, userRole: string, ipAddress?: string): Promise<{
        message: string;
    }>;
}
