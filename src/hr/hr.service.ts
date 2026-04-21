import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHrRateDto } from './dto/create-hr-rate.dto';
import { UpdateHrRateDto } from './dto/update-hr-rate.dto';

@Injectable()
export class HrService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateHrRateDto) {
    return this.prisma.hrRate.create({ data: dto });
  }

  async findAll() {
    return this.prisma.hrRate.findMany({ orderBy: { role: 'asc' } });
  }

  async findOne(id: string) {
    const rate = await this.prisma.hrRate.findUnique({ where: { id } });
    if (!rate) throw new NotFoundException(`HR rate ${id} not found`);
    return rate;
  }

  async update(id: string, dto: UpdateHrRateDto) {
    await this.findOne(id);
    return this.prisma.hrRate.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.hrRate.delete({ where: { id } });
  }

  async bulkUpsert(rates: CreateHrRateDto[]) {
    return this.prisma.$transaction(
      rates.map((r) =>
        this.prisma.hrRate.upsert({
          where: { role: r.role },
          create: r,
          update: { dailyRateGHS: r.dailyRateGHS },
        }),
      ),
    );
  }
}
