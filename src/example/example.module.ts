import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { DatabaseService } from '../database';

@Module({
  providers: [ExampleService, DatabaseService],
  controllers: [ExampleController],
})
export class ExampleModule {}
