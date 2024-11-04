import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseService } from '../database';

@Module({
  controllers: [AdminController],
  providers: [AdminService, DatabaseService],
})
export class AdminModule {}
