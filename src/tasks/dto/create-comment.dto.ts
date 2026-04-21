import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Site Manager' })
  @IsString()
  author: string;

  @ApiProperty({ example: 'Ensure pressure testing is done before backfilling' })
  @IsString()
  text: string;

  @ApiProperty({ example: '15/04/26' })
  @IsString()
  date: string;
}
