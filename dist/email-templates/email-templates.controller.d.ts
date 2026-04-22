import { EmailTemplatesService } from './email-templates.service';
export declare class EmailTemplatesController {
    private emailTemplatesService;
    constructor(emailTemplatesService: EmailTemplatesService);
    findAll(): Promise<{
        name: string;
        id: string;
        updatedAt: Date;
        subject: string;
        slug: string;
        bodyHtml: string;
        bodyText: string | null;
        variables: string[];
        updatedById: string | null;
    }[]>;
    findOne(slug: string): Promise<{
        name: string;
        id: string;
        updatedAt: Date;
        subject: string;
        slug: string;
        bodyHtml: string;
        bodyText: string | null;
        variables: string[];
        updatedById: string | null;
    }>;
    update(slug: string, data: {
        subject?: string;
        bodyHtml?: string;
        bodyText?: string;
    }, req: any): Promise<{
        name: string;
        id: string;
        updatedAt: Date;
        subject: string;
        slug: string;
        bodyHtml: string;
        bodyText: string | null;
        variables: string[];
        updatedById: string | null;
    }>;
    test(body: {
        slug: string;
        email: string;
    }): Promise<{
        message: string;
    }>;
}
