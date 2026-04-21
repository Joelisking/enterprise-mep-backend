import { ApiProperty } from '@nestjs/swagger';
import { TechnicianRole } from '@prisma/client';

export class TechnicianEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty({ example: 'Kofi Mensah' })
  name: string;

  @ApiProperty({ enum: TechnicianRole, example: TechnicianRole.PLUMBER })
  role: TechnicianRole;
}
