import { ApiProperty } from '@nestjs/swagger';

export class HrRateEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Plumber' })
  role: string;

  @ApiProperty({ example: 120.0 })
  dailyRateGHS: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
