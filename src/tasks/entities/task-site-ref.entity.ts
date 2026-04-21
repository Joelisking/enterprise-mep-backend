import { ApiProperty } from '@nestjs/swagger';

export class TaskSiteRefEntity {
  @ApiProperty({ example: 'accra-central' })
  id: string;

  @ApiProperty({ example: 'Accra Central' })
  name: string;
}
