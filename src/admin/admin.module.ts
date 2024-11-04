import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy';

@Module({
  controllers: [AdminController],
  providers: [
    AdminService,
    DatabaseService,
    TokenService,
    JwtService,
    JwtStrategy,
  ],
})
export class AdminModule {}
