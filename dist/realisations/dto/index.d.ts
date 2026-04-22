export declare class CreateRealisationDto {
    slug: string;
    titleFr: string;
    titleEn?: string;
    location: string;
    date: string;
    scope: string;
    descFr: string;
    descEn?: string;
    tags: string[];
    images: string[];
    client?: string;
    isFeatured?: boolean;
}
export declare class UpdateRealisationDto {
    slug?: string;
    titleFr?: string;
    titleEn?: string;
    location?: string;
    date?: string;
    scope?: string;
    descFr?: string;
    descEn?: string;
    tags?: string[];
    images?: string[];
    client?: string;
    isActive?: boolean;
    isFeatured?: boolean;
}
export declare class RealisationQueryDto {
    page?: number;
    limit?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    tag?: string;
    location?: string;
}
