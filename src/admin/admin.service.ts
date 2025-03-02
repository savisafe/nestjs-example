import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { AdminLoginDto } from './dto';
import { getAdminData, loginAdmin } from './services';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
  async getAdmin(request: Request) {
    return await getAdminData(request, this.tokenService, this.dataBase);
  }
  async loginAdmin(data: AdminLoginDto) {
    return await loginAdmin(data, this.tokenService, this.dataBase);
  }
}
