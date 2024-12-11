import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly loginService: AdminService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async get_admin(@Res({ passthrough: true }) response, @Req() request) {
    return this.loginService.getAdmin(response, request);
  }
  @Post()
  @HttpCode(HttpStatus.OK)
  async login_admin(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) response,
  ) {
    return this.loginService.loginAdmin(dto, response);
  }
}
