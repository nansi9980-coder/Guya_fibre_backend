import { ContactService, CreateContactDto } from './contact.service';
export declare class ContactController {
    private contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto, req: any): Promise<{
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
    markAsRead(id: string, req: any): Promise<{
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
    remove(id: string, req: any): Promise<void>;
}
