import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { UserTypeService } from './user-type.service';
import { UserType } from './entities/user-type.model';

@Controller('user-type')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Post()
  create(@Body() data: Partial<UserType>) {
    return this.userTypeService.create(data);
  }

  @Get()
  findAll() {
    return this.userTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userTypeService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<UserType>) {
    return this.userTypeService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userTypeService.remove(Number(id));
  }
}
