import { Module } from '@nestjs/common';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../strategy';

@Module({
  providers: [DatabaseService, TokenService, JwtService, JwtStrategy],
})
export class AdminCheckModule {}
