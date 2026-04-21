import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Scope, TaskStatus, TechnicianRole } from '@prisma/client';
import { TechnicianDto, TaskMaterialDto } from './create-task.dto';

export class UpdateTaskDto {
  @ApiPropertyOptional({ enum: Scope })
  @IsOptional()
  @IsEnum(Scope)
  scope?: Scope;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taskName?: string;

  @ApiPropertyOptional({ enum: TaskStatus })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  previousProgressPercent?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  estimatedDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  daysElapsed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  qualityRating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional()
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
