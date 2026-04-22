import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceContentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titleFr: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleEs?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titlePt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleNl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleGcr?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  descFr: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descEn?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  benefit?: string;
}

export class UpdateServiceContentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  number?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleFr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleEn?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleEs?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titlePt?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleNl?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  titleGcr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descFr?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  descEn?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  benefit?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class ReorderDto {
  @ApiProperty({ type: [{ id: String, order: Number }] })
  @IsArray()
  items: { id: string; order: number }[];
}