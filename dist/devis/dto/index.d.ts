export declare enum DevisStatus {
    NEW = "NEW",
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    QUOTE_SENT = "QUOTE_SENT",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare enum Urgency {
    LOW = "LOW",
    NORMAL = "NORMAL",
    HIGH = "HIGH",
    URGENT = "URGENT"
}
export declare class CreateDevisDto {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    company?: string;
    services: string[];
    location: string;
    address?: string;
    postalCode?: string;
    description: string;
    urgency?: Urgency;
    website?: string;
}
export declare class UpdateDevisStatusDto {
    status: DevisStatus;
    amount?: number;
}
export declare class AddNoteDto {
    content: string;
}
export declare class RespondDevisDto {
    subject: string;
    body: string;
}
export declare class DevisQueryDto {
    page?: number;
    limit?: number;
    status?: DevisStatus;
    location?: string;
    urgency?: Urgency;
    search?: string;
    startDate?: string;
    endDate?: string;
}
export { UpdateAmountDto } from './update-amount.dto';
