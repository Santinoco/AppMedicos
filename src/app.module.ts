import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AppointmentController } from './appointment/appointment.controller';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [AppController, AppointmentController],
  providers: [AppService],
})
export class AppModule {}
