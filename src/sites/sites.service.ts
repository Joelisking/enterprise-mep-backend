import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSiteDto) {
    const existing = await this.prisma.site.findUnique({ where: { id: dto.id } });
    if (existing) throw new ConflictException(`Site with id '${dto.id}' already exists`);
    return this.prisma.site.create({ data: dto });
  }

  async findAll() {
    return this.prisma.site.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: {
        tasks: {
          include: { technicians: true, materialsUsed: true, comments: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!site) throw new NotFoundException(`Site '${id}' not found`);
    return site;
  }

  async update(id: string, dto: UpdateSiteDto) {
    await this.findOne(id);
    return this.prisma.site.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.site.delete({ where: { id } });
  }
}
