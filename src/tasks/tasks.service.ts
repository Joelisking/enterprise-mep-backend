import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BulkCreateTasksDto } from './dto/bulk-create-tasks.dto';
import { Scope, TaskStatus } from '@prisma/client';

const TASK_INCLUDE = {
  technicians: true,
  materialsUsed: { include: { material: true } },
  comments: { orderBy: { createdAt: 'asc' as const } },
  site: { select: { id: true, name: true } },
};

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto) {
    const { technicians, materialsUsed, ...rest } = dto;
    return this.prisma.task.create({
      data: {
        ...rest,
        technicians: technicians ? { create: technicians } : undefined,
        materialsUsed: materialsUsed ? { create: materialsUsed } : undefined,
      },
      include: TASK_INCLUDE,
    });
  }

  async findAll(filter?: { siteId?: string; scope?: Scope; status?: TaskStatus }) {
    return this.prisma.task.findMany({
      where: {
        ...(filter?.siteId && { siteId: filter.siteId }),
        ...(filter?.scope && { scope: filter.scope }),
        ...(filter?.status && { status: filter.status }),
      },
      include: TASK_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id }, include: TASK_INCLUDE });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    await this.findOne(id);
    const { technicians, materialsUsed, ...rest } = dto;

    return this.prisma.$transaction(async (tx) => {
      if (technicians !== undefined) {
        await tx.technician.deleteMany({ where: { taskId: id } });
      }
      if (materialsUsed !== undefined) {
        await tx.taskMaterial.deleteMany({ where: { taskId: id } });
      }
      return tx.task.update({
        where: { id },
        data: {
          ...rest,
          ...(technicians !== undefined && { technicians: { create: technicians } }),
          ...(materialsUsed !== undefined && { materialsUsed: { create: materialsUsed } }),
        },
        include: TASK_INCLUDE,
      });
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
  }

  async addComment(taskId: string, dto: CreateCommentDto) {
    await this.findOne(taskId);
    return this.prisma.comment.create({ data: { ...dto, taskId } });
  }

  async removeComment(taskId: string, commentId: string) {
    const comment = await this.prisma.comment.findFirst({ where: { id: commentId, taskId } });
    if (!comment) throw new NotFoundException(`Comment ${commentId} not found on task ${taskId}`);
    await this.prisma.comment.delete({ where: { id: commentId } });
  }

  async bulkCreate(dto: BulkCreateTasksDto) {
    // Auto-create any sites that don't exist yet
    const uniqueSiteIds = [...new Set(dto.tasks.map(t => t.siteId))];
    const existingSites = await this.prisma.site.findMany({
      where: { id: { in: uniqueSiteIds } },
      select: { id: true },
    });
    const existingIds = new Set(existingSites.map(s => s.id));
    const missingSiteIds = uniqueSiteIds.filter(id => !existingIds.has(id));

    if (missingSiteIds.length) {
      await this.prisma.site.createMany({
        data: missingSiteIds.map(id => ({
          id,
          name: dto.siteHints?.find(h => h.id === id)?.name
            ?? id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          location: 'Unknown',
          supervisor: 'TBC',
          supervisorPhone: 'TBC',
        })),
        skipDuplicates: true,
      });
    }

    // Upsert tasks sequentially — each task is its own implicit or mini transaction
    // to avoid hitting the 5s interactive transaction timeout on large uploads
    const results = [];
    for (const { technicians, materialsUsed, ...rest } of dto.tasks) {
      const existing = await this.prisma.task.findFirst({
        where: { siteId: rest.siteId, taskName: rest.taskName, date: rest.date },
        select: { id: true },
      });

      if (existing) {
        const updated = await this.prisma.$transaction([
          this.prisma.technician.deleteMany({ where: { taskId: existing.id } }),
          this.prisma.taskMaterial.deleteMany({ where: { taskId: existing.id } }),
          this.prisma.task.update({
            where: { id: existing.id },
            data: {
              ...rest,
              technicians: technicians?.length ? { create: technicians } : undefined,
              materialsUsed: materialsUsed?.length ? { create: materialsUsed } : undefined,
            },
            include: TASK_INCLUDE,
          }),
        ]);
        results.push(updated[2]);
      } else {
        results.push(await this.prisma.task.create({
          data: {
            ...rest,
            technicians: technicians?.length ? { create: technicians } : undefined,
            materialsUsed: materialsUsed?.length ? { create: materialsUsed } : undefined,
          },
          include: TASK_INCLUDE,
        }));
      }
    }
    return results;
  }
}
