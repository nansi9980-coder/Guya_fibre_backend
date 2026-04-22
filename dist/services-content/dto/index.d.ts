export declare class CreateServiceContentDto {
    slug: string;
    number: string;
    icon: string;
    titleFr: string;
    titleEn?: string;
    titleEs?: string;
    titlePt?: string;
    titleNl?: string;
    titleGcr?: string;
    descFr: string;
    descEn?: string;
    features: string[];
    image?: string;
    benefit?: string;
}
export declare class UpdateServiceContentDto {
    slug?: string;
    number?: string;
    icon?: string;
    titleFr?: string;
    titleEn?: string;
    titleEs?: string;
    titlePt?: string;
    titleNl?: string;
    titleGcr?: string;
    descFr?: string;
    descEn?: string;
    features?: string[];
    image?: string;
    benefit?: string;
    isActive?: boolean;
}
export declare class ReorderDto {
    items: {
        id: string;
        order: number;
    }[];
}
