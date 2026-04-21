import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@ApiTags('sites')
@ApiBearerAuth()
@Controller('sites')
export class SitesController {
  constructor(private sitesService: SitesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a site' })
  create(@Body() dto: CreateSiteDto) {
    return this.sitesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all sites' })
  findAll() {
    return this.sitesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a site with all tasks' })
  findOne(@Param('id') id: string) {
    return this.sitesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a site' })
  update(@Param('id') id: string, @Body() dto: UpdateSiteDto) {
    return this.sitesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a site' })
  remove(@Param('id') id: string) {
    return this.sitesService.remove(id);
  }
}
