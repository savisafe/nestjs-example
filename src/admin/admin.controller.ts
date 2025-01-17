import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly loginService: AdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get_admin(@Req() request) {
    return this.loginService.getAdmin(request);
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  async login_admin(@Body() dto: AdminLoginDto) {
    return this.loginService.loginAdmin(dto);
  }
}
