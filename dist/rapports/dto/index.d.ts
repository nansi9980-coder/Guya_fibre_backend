export declare enum RapportStatus {
    DRAFT = "DRAFT",
    SIGNED = "SIGNED",
    ARCHIVED = "ARCHIVED"
}
export declare enum SupportType {
    IMB = "IMB",
    MAISON = "MAISON",
    BATIMENT = "BATIMENT",
    LOCAL_PRO = "LOCAL_PRO",
    AUTRE = "AUTRE"
}
export declare class CreateRapportDto {
    title: string;
    typeSupport?: SupportType;
    devisId?: string;
    batiment?: string;
    batimentChoix?: string;
    hall?: string;
    appartement?: string;
    localTechnique?: string;
    localTechniqueLocalisation?: string;
    photoLocalTechniqueUrl?: string;
    photoPavillonUrl?: string;
    gpsLat?: number;
    gpsLng?: number;
    notes?: string;
}
export declare class UpdateRapportDto {
    title?: string;
    typeSupport?: SupportType;
    status?: RapportStatus;
    batiment?: string;
    batimentChoix?: string;
    hall?: string;
    appartement?: string;
    localTechnique?: string;
    localTechniqueLocalisation?: string;
    photoLocalTechniqueUrl?: string;
    photoPavillonUrl?: string;
    gpsLat?: number;
    gpsLng?: number;
    notes?: string;
}
export declare class SignRapportDto {
    signatureTechnicien: string;
    signatureClient?: string;
}
export declare class RapportQueryDto {
    page?: number;
    limit?: number;
    status?: RapportStatus;
    search?: string;
    authorId?: string;
    startDate?: string;
    endDate?: string;
}
