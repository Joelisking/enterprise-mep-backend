import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserEntity {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'kwaku@asera.gh' })
  email: string;

  @ApiProperty({ example: 'Kwaku Mensah' })
  name: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MANAGER })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
