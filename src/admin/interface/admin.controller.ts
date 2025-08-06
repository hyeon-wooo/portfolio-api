import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminService } from '../app/admin.service';
import { Admin } from '../domain/admin.entity';
import { CreateAdminDto, UpdateAdminDto } from './admin.dto';
import { EmailAlreadyExistsException } from '../domain/admin.exception';
import { sendFailRes, sendSuccessRes } from 'src/shared/response';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/')
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Admin | null> {
    return this.adminService.findOne(id);
  }

  @Post('/')
  async create(@Body() dto: CreateAdminDto) {
    try {
      const created = await this.adminService.create(dto);

      return sendSuccessRes({ id: created.id });
    } catch (error) {
      if (error instanceof EmailAlreadyExistsException)
        return sendFailRes(error.message, error.code);

      throw error;
    }
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateAdminDto,
  ): Promise<Admin> {
    return this.adminService.update(id, dto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.adminService.delete(id);
  }
}
