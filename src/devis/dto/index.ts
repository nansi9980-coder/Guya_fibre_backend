import { IsString, IsEmail, IsNotEmpty, IsArray, IsOptional, IsEnum, MinLength, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum DevisStatus {
  NEW = 'NEW',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  QUOTE_SENT = 'QUOTE_SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum Urgency {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// ==================== DTO EXISTANTS ====================
export class CreateDevisDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  clientName!: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  clientEmail!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  clientPhone!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  services!: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ enum: Urgency })
  @IsEnum(Urgency)
  @IsOptional()
  urgency?: Urgency;

  // Honeypot anti-spam
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  website?: string;
}

export class UpdateDevisStatusDto {
  @ApiProperty({ enum: DevisStatus })
  @IsEnum(DevisStatus)
  status!: DevisStatus;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  amount?: number;
}

export class AddNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;
}

export class RespondDevisDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body!: string;
}

export class DevisQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ enum: DevisStatus })
  @IsOptional()
  @IsEnum(DevisStatus)
  status?: DevisStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ enum: Urgency })
  @IsOptional()
  @IsEnum(Urgency)
  urgency?: Urgency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endDate?: string;
}

// ==================== NOUVEAU DTO POUR LE MONTANT ====================
export { UpdateAmountDto } from './update-amount.dto';