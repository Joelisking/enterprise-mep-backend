import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { HrService } from './hr.service';
import { CreateHrRateDto } from './dto/create-hr-rate.dto';
import { UpdateHrRateDto } from './dto/update-hr-rate.dto';
import { BulkUpsertHrDto } from './dto/bulk-upsert-hr.dto';

@ApiTags('hr')
@ApiBearerAuth()
@Controller('hr/rates')
export class HrController {
  constructor(private hrService: HrService) {}

  @Post()
  @ApiOperation({ summary: 'Create an HR daily rate' })
  create(@Body() dto: CreateHrRateDto) {
    return this.hrService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all HR daily rates' })
  findAll() {
    return this.hrService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an HR rate by ID' })
  findOne(@Param('id') id: string) {
    return this.hrService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an HR rate' })
  update(@Param('id') id: string, @Body() dto: UpdateHrRateDto) {
    return this.hrService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an HR rate' })
  remove(@Param('id') id: string) {
    return this.hrService.remove(id);
  }

  @Put('bulk')
  @ApiOperation({ summary: 'Bulk upsert HR rates (used by Excel upload)' })
  bulkUpsert(@Body() dto: BulkUpsertHrDto) {
    return this.hrService.bulkUpsert(dto.rates);
  }
}
