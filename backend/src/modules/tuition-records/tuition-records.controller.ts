import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TuitionRecordsService } from './tuition-records.service';
import { CreateTuitionRecordDto } from './dto/create-tuition-record.dto';
import { TuitionQueryDto } from './dto/tuition-query.dto';

@Controller('tuition-records')
export class TuitionRecordsController {
  constructor(private readonly tuitionService: TuitionRecordsService) {}

  @Post()
  create(@Body() createDto: CreateTuitionRecordDto) {
    return this.tuitionService.create(createDto);
  }

  @Get()
  findAll(@Query() query: TuitionQueryDto) {
    return this.tuitionService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tuitionService.findOne(id);
  }

  @Get('student/:studentId')
  findByStudent(@Param('studentId') studentId: string) {
    return this.tuitionService.findByStudent(studentId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: any) {
    return this.tuitionService.update(id, updateDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.tuitionService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tuitionService.remove(id);
  }
}
