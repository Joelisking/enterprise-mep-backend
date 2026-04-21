import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { BulkUpsertMaterialsDto } from './dto/bulk-upsert-materials.dto';

@ApiTags('procurement')
@ApiBearerAuth()
@Controller('procurement/materials')
export class ProcurementController {
  constructor(private procurementService: ProcurementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a material' })
  create(@Body() dto: CreateMaterialDto) {
    return this.procurementService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all materials' })
  findAll() {
    return this.procurementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a material by ID' })
  findOne(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a material' })
  update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return this.procurementService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a material' })
  remove(@Param('id') id: string) {
    return this.procurementService.remove(id);
  }

  @Put('bulk')
  @ApiOperation({ summary: 'Bulk upsert materials (used by Excel upload)' })
  bulkUpsert(@Body() dto: BulkUpsertMaterialsDto) {
    return this.procurementService.bulkUpsert(dto.materials);
  }
}
