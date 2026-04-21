import { ApiProperty } from '@nestjs/swagger';
import { SiteEntity } from './site.entity';
import { TaskEntity } from '../../tasks/entities/task.entity';

export class SiteWithTasksEntity extends SiteEntity {
  @ApiProperty({ type: [TaskEntity] })
  tasks: TaskEntity[];
}
