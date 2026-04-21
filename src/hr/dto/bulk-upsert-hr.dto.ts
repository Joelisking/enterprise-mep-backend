import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHrRateDto } from './create-hr-rate.dto';

export class BulkUpsertHrDto {
  @ApiProperty({ type: [CreateHrRateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHrRateDto)
  rates: CreateHrRateDto[];
}
