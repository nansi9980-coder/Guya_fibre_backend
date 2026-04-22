import { IsNumber, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAmountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber({}, { message: 'Le montant doit être un nombre valide' })
  amount?: number;
}