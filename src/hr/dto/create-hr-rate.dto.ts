import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class CreateHrRateDto {
  @ApiProperty({ example: 'Plumber' })
  @IsString()
  role: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @Min(0)
  dailyRateGHS: number;
}
