import { ApiProperty } from '@nestjs/swagger';

export class CommentEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  taskId: string;

  @ApiProperty({ example: 'Site Manager' })
  author: string;

  @ApiProperty()
  text: string;

  @ApiProperty({ example: '15/04/26' })
  date: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
