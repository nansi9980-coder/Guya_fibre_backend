import {
  IsString, IsNotEmpty, IsOptional, IsEnum,
  IsNumber, IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum RapportStatus {
  DRAFT    = 'DRAFT',
  SIGNED   = 'SIGNED',
  ARCHIVED = 'ARCHIVED',
}

export enum SupportType {
  IMB        = 'IMB',
  MAISON     = 'MAISON',
  BATIMENT   = 'BATIMENT',
  LOCAL_PRO  = 'LOCAL_PRO',
  AUTRE      = 'AUTRE',
}

export class CreateRapportDto {
  @ApiProperty()
  @IsString() @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ enum: SupportType })
  @IsEnum(SupportType) @IsOptional()
  typeSupport?: SupportType;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  devisId?: string;

  // Localisation
  @ApiPropertyOptional()
  @IsString() @IsOptional()
  batiment?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  batimentChoix?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  hall?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  appartement?: string;

  // Local technique
  @ApiPropertyOptional()
  @IsString() @IsOptional()
  localTechnique?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  localTechniqueLocalisation?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  photoLocalTechniqueUrl?: string;

  // Pavillon / appartement
  @ApiPropertyOptional()
  @IsString() @IsOptional()
  photoPavillonUrl?: string;

  @ApiPropertyOptional()
  @IsNumber() @IsOptional() @Type(() => Number)
  gpsLat?: number;

  @ApiPropertyOptional()
  @IsNumber() @IsOptional() @Type(() => Number)
  gpsLng?: number;

  // Notes
  @ApiPropertyOptional()
  @IsString() @IsOptional()
  notes?: string;
}

export class UpdateRapportDto {
  @ApiPropertyOptional()
  @IsString() @IsOptional()
  title?: string;

  @ApiPropertyOptional({ enum: SupportType })
  @IsEnum(SupportType) @IsOptional()
  typeSupport?: SupportType;

  @ApiPropertyOptional({ enum: RapportStatus })
  @IsEnum(RapportStatus) @IsOptional()
  status?: RapportStatus;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  batiment?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  batimentChoix?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  hall?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  appartement?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  localTechnique?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  localTechniqueLocalisation?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  photoLocalTechniqueUrl?: string;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  photoPavillonUrl?: string;

  @ApiPropertyOptional()
  @IsNumber() @IsOptional() @Type(() => Number)
  gpsLat?: number;

  @ApiPropertyOptional()
  @IsNumber() @IsOptional() @Type(() => Number)
  gpsLng?: number;

  @ApiPropertyOptional()
  @IsString() @IsOptional()
  notes?: string;
}

export class SignRapportDto {
  @ApiProperty({ description: 'Signature technicien en base64' })
  @IsString() @IsNotEmpty()
  signatureTechnicien!: string;

  @ApiPropertyOptional({ description: 'Signature client en base64' })
  @IsString() @IsOptional()
  signatureClient?: string;
}

export class RapportQueryDto {
  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional() @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ enum: RapportStatus })
  @IsOptional() @IsEnum(RapportStatus)
  status?: RapportStatus;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  authorId?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional() @IsString()
  endDate?: string;
}
