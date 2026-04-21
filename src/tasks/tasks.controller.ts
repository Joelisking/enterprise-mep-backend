import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Scope, TaskStatus } from '@prisma/client';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task' })
  create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List tasks — filter by siteId, scope, or status' })
  @ApiQuery({ name: 'siteId', required: false })
  @ApiQuery({ name: 'scope', required: false, enum: Scope })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus })
  findAll(
    @Query('siteId') siteId?: string,
    @Query('scope') scope?: Scope,
    @Query('status') status?: TaskStatus,
  ) {
    return this.tasksService.findAll({ siteId, scope, status });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task with technicians, materials, and comments' })
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task (replaces technicians/materials if provided)' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  addComment(@Param('id') id: string, @Body() dto: CreateCommentDto) {
    return this.tasksService.addComment(id, dto);
  }

  @Delete(':id/comments/:commentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a comment from a task' })
  removeComment(@Param('id') id: string, @Param('commentId') commentId: string) {
    return this.tasksService.removeComment(id, commentId);
  }
}
