import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus, Put } from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation,
  ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { BulkUpsertMaterialsDto } from './dto/bulk-upsert-materials.dto';
import { MaterialEntity } from './entities/material.entity';

@ApiTags('procurement')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
@Controller('procurement/materials')
export class ProcurementController {
  constructor(private procurementService: ProcurementService) {}

  @Post()
  @ApiOperation({ summary: 'Create a material' })
  @ApiCreatedResponse({ type: MaterialEntity })
  create(@Body() dto: CreateMaterialDto) {
    return this.procurementService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all materials' })
  @ApiOkResponse({ type: [MaterialEntity] })
  findAll() {
    return this.procurementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a material by ID' })
  @ApiOkResponse({ type: MaterialEntity })
  @ApiNotFoundResponse({ description: 'Material not found' })
  findOne(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a material' })
  @ApiOkResponse({ type: MaterialEntity })
  @ApiNotFoundResponse({ description: 'Material not found' })
  update(@Param('id') id: string, @Body() dto: UpdateMaterialDto) {
    return this.procurementService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a material' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Material not found' })
  remove(@Param('id') id: string) {
    return this.procurementService.remove(id);
  }

  @Put('bulk')
  @ApiOperation({ summary: 'Bulk upsert materials (used by Excel upload)' })
  @ApiOkResponse({ type: [MaterialEntity] })
  bulkUpsert(@Body() dto: BulkUpsertMaterialsDto) {
    return this.procurementService.bulkUpsert(dto.materials);
  }
}
