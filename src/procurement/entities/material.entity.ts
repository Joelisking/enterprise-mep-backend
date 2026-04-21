import { ApiProperty } from '@nestjs/swagger';

export class MaterialEntity {
  @ApiProperty({ example: 'pipe-pvc-1' })
  id: string;

  @ApiProperty({ example: 'PVC Pipe 1"' })
  materialName: string;

  @ApiProperty({ example: 25.0 })
  unitCostGHS: number;

  @ApiProperty({ example: 'meter' })
  unit: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
