import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserType } from './entities/user-type.model';
import { UserTypeService } from './user-type.service';
import { UserTypeController } from './user-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserType])],
  providers: [UserTypeService],
  controllers: [UserTypeController],
})
export class UserTypeModule {}
