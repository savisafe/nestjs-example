import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class AdminService {
  constructor(private readonly dataBase: DatabaseService) {}

  async getAdmin() {
    return this.dataBase.admin.findFirst({
      select: {
        name: true,
      },
    });
  }
  async loginAdmin(data) {
    const { login, password } = data;
    return this.dataBase.admin.findFirst({
      where: {
        login,
        password,
      },
      select: {
        name: true,
        id: true,
      },
    });
  }
  async exitAdmin() {
    // TODO: Работа с куками
    return 'Вышел';
  }
}
