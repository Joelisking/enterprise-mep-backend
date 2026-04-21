import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Scope, TaskStatus } from '@prisma/client';
import { TechnicianEntity } from './technician.entity';
import { TaskMaterialEntity } from './task-material.entity';
import { CommentEntity } from './comment.entity';
import { TaskSiteRefEntity } from './task-site-ref.entity';

export class TaskEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'accra-central' })
  siteId: string;

  @ApiProperty({ enum: Scope, example: Scope.PLUMBING })
  scope: Scope;

  @ApiProperty({ example: 'Main Water Line Installation' })
  taskName: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.IN_PROGRESS })
  status: TaskStatus;

  @ApiProperty({ example: 65 })
  progressPercent: number;

  @ApiProperty({ example: 60 })
  previousProgressPercent: number;

  @ApiProperty({ example: 14 })
  estimatedDays: number;

  @ApiProperty({ example: 9 })
  daysElapsed: number;

  @ApiProperty({ example: 4 })
  qualityRating: number;

  @ApiProperty({ example: '15/04/26' })
  date: string;

  @ApiProperty({ example: 'Good progress on main line' })
  notes: string;

  @ApiPropertyOptional({ type: [TechnicianEntity] })
  technicians?: TechnicianEntity[];

  @ApiPropertyOptional({ type: [TaskMaterialEntity] })
  materialsUsed?: TaskMaterialEntity[];

  @ApiPropertyOptional({ type: [CommentEntity] })
  comments?: CommentEntity[];

  @ApiPropertyOptional({ type: TaskSiteRefEntity })
  site?: TaskSiteRefEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
