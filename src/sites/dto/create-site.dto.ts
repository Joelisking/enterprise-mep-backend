import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({ example: 'accra-central', description: 'Slug ID used as primary key' })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, { message: 'id must be a lowercase slug (e.g. accra-central)' })
  id: string;

  @ApiProperty({ example: 'Accra Central' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Accra CBD' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Kwaku Mensah' })
  @IsString()
  supervisor: string;

  @ApiProperty({ example: '024 555 1234' })
  @IsString()
  supervisorPhone: string;
}
