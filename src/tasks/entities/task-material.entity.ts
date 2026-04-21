import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialEntity } from '../../procurement/entities/material.entity';

export class TaskMaterialEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty({ example: 'pipe-pvc-2' })
  materialId: string;

  @ApiProperty({ example: 45.0 })
  quantity: number;

  @ApiPropertyOptional({ type: MaterialEntity })
  material?: MaterialEntity;
}
