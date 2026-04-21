import { ApiProperty } from '@nestjs/swagger';

export class SiteEntity {
  @ApiProperty({ example: 'accra-central' })
  id: string;

  @ApiProperty({ example: 'Accra Central' })
  name: string;

  @ApiProperty({ example: 'Accra CBD' })
  location: string;

  @ApiProperty({ example: 'Kwaku Mensah' })
  supervisor: string;

  @ApiProperty({ example: '024 555 1234' })
  supervisorPhone: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
