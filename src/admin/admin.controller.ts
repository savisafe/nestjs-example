import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly loginService: AdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get_admin() {
    return this.loginService.getAdmin();
  }
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login_admin(@Body() dto: AdminLoginDto) {
    return this.loginService.loginAdmin(dto);
  }
  @Get('exit')
  @HttpCode(HttpStatus.OK)
  async exit_admin() {
    return this.loginService.exitAdmin();
  }
}
