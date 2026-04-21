import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTaskDto } from './create-task.dto';

export class SiteHintDto {
  @ApiProperty({ example: 'canary' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  id: string;

  @ApiProperty({ example: 'CANARY' })
  @IsString()
  name: string;
}

export class BulkCreateTasksDto {
  @ApiProperty({ type: [CreateTaskDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTaskDto)
  tasks: CreateTaskDto[];

  @ApiPropertyOptional({ type: [SiteHintDto], description: 'Names for auto-creating unknown sites' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SiteHintDto)
  siteHints?: SiteHintDto[];
}
