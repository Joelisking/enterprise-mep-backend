import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Matches, Min } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({ example: 'pipe-pvc-1', description: 'Slug ID used as primary key' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'id must be a lowercase slug' })
  id: string;

  @ApiProperty({ example: 'PVC Pipe 1"' })
  @IsString()
  materialName: string;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  unitCostGHS: number;

  @ApiProperty({ example: 'meter' })
  @IsString()
  unit: string;
}
