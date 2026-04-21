import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Scope, TaskStatus, TechnicianRole } from '@prisma/client';

export class TechnicianDto {
  @ApiProperty({ example: 'Kofi Mensah' })
  @IsString()
  name: string;

  @ApiProperty({ enum: TechnicianRole })
  @IsEnum(TechnicianRole)
  role: TechnicianRole;
}

export class TaskMaterialDto {
  @ApiProperty({ example: 'pipe-pvc-2' })
  @IsString()
  materialId: string;

  @ApiProperty({ example: 45 })
  @IsNumber()
  @Min(0)
  quantity: number;
}

export class CreateTaskDto {
  @ApiProperty({ example: 'accra-central' })
  @IsString()
  siteId: string;

  @ApiProperty({ enum: Scope })
  @IsEnum(Scope)
  scope: Scope;

  @ApiProperty({ example: 'Main Water Line Installation' })
  @IsString()
  taskName: string;

  @ApiProperty({ enum: TaskStatus })
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiProperty({ example: 65 })
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  previousProgressPercent?: number;

  @ApiProperty({ example: 14 })
  @IsInt()
  @Min(1)
  estimatedDays: number;

  @ApiProperty({ example: 9 })
  @IsInt()
  @Min(0)
  daysElapsed: number;

  @ApiProperty({ example: 4, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  qualityRating: number;

  @ApiProperty({ example: '15/04/26' })
  @IsString()
  date: string;

  @ApiPropertyOptional({ example: 'Good progress on main line' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [TechnicianDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TechnicianDto)
  technicians?: TechnicianDto[];

  @ApiPropertyOptional({ type: [TaskMaterialDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskMaterialDto)
  materialsUsed?: TaskMaterialDto[];
}
