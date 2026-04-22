import { Response } from 'express';
import { DevisService } from './devis.service';
import { CreateDevisDto, UpdateDevisStatusDto, AddNoteDto, RespondDevisDto, DevisQueryDto, UpdateAmountDto } from './dto';
export declare class DevisController {
    private devisService;
    constructor(devisService: DevisService);
    create(createDevisDto: CreateDevisDto, req: any): Promise<{
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
    exportCsv(query: DevisQueryDto, res: Response): Promise<void>;
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
    updateAmount(id: string, updateAmountDto: UpdateAmountDto, req: any): Promise<{
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
    updateStatus(id: string, updateStatusDto: UpdateDevisStatusDto, req: any): Promise<{
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
    addNote(id: string, addNoteDto: AddNoteDto, req: any): Promise<{
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
    respond(id: string, respondDevisDto: RespondDevisDto, req: any): Promise<{
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
    assign(id: string, userId: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
