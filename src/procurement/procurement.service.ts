import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class ProcurementService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateMaterialDto) {
    return this.prisma.material.create({ data: dto });
  }

  async findAll() {
    return this.prisma.material.findMany({ orderBy: { materialName: 'asc' } });
  }

  async findOne(id: string) {
    const material = await this.prisma.material.findUnique({ where: { id } });
    if (!material) throw new NotFoundException(`Material '${id}' not found`);
    return material;
  }

  async update(id: string, dto: UpdateMaterialDto) {
    await this.findOne(id);
    return this.prisma.material.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.material.delete({ where: { id } });
  }

  async bulkUpsert(materials: CreateMaterialDto[]) {
    return this.prisma.$transaction(
      materials.map((m) =>
        this.prisma.material.upsert({
          where: { id: m.id },
          create: m,
          update: { materialName: m.materialName, unitCostGHS: m.unitCostGHS, unit: m.unit },
        }),
      ),
    );
  }
}
