import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus, Put } from '@nestjs/common';
import {
  ApiTags, ApiBearerAuth, ApiOperation,
  ApiOkResponse, ApiCreatedResponse, ApiNoContentResponse,
  ApiNotFoundResponse, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HrService } from './hr.service';
import { CreateHrRateDto } from './dto/create-hr-rate.dto';
import { UpdateHrRateDto } from './dto/update-hr-rate.dto';
import { BulkUpsertHrDto } from './dto/bulk-upsert-hr.dto';
import { HrRateEntity } from './entities/hr-rate.entity';

@ApiTags('hr')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
@Controller('hr/rates')
export class HrController {
  constructor(private hrService: HrService) {}

  @Post()
  @ApiOperation({ summary: 'Create an HR daily rate' })
  @ApiCreatedResponse({ type: HrRateEntity })
  create(@Body() dto: CreateHrRateDto) {
    return this.hrService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all HR daily rates' })
  @ApiOkResponse({ type: [HrRateEntity] })
  findAll() {
    return this.hrService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an HR rate by ID' })
  @ApiOkResponse({ type: HrRateEntity })
  @ApiNotFoundResponse({ description: 'HR rate not found' })
  findOne(@Param('id') id: string) {
    return this.hrService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an HR rate' })
  @ApiOkResponse({ type: HrRateEntity })
  @ApiNotFoundResponse({ description: 'HR rate not found' })
  update(@Param('id') id: string, @Body() dto: UpdateHrRateDto) {
    return this.hrService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an HR rate' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'HR rate not found' })
  remove(@Param('id') id: string) {
    return this.hrService.remove(id);
  }

  @Put('bulk')
  @ApiOperation({ summary: 'Bulk upsert HR rates (used by Excel upload)' })
  @ApiOkResponse({ type: [HrRateEntity] })
  bulkUpsert(@Body() dto: BulkUpsertHrDto) {
    return this.hrService.bulkUpsert(dto.rates);
  }
}
