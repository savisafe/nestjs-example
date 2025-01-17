import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { FAILED_TO_ADMIN_DATA, FAILED_TO_LOGIN } from '../consts';
import { TokenService } from '../token';
import { setToken } from '../functions';
import { Roles } from '../types';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
  async getAdmin(request) {
    const token = setToken(request);
    if (!token)
      throw new HttpException(FAILED_TO_ADMIN_DATA, HttpStatus.UNAUTHORIZED);
    const user = await this.tokenService.verifyToken(token);
    try {
      const { id } = await this.dataBase.admin.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          role: true,
        },
      });
      return {
        id,
        role: Roles.Admin,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(FAILED_TO_ADMIN_DATA, HttpStatus.BAD_REQUEST);
    }
  }
  async loginAdmin(data) {
    const { login, password } = data;
    try {
      const { id } = await this.dataBase.admin.findUnique({
        where: {
          login,
          password,
        },
        select: {
          id: true,
          role: true,
        },
      });
      const token = await this.tokenService.generateJwtToken({ id });
      return {
        id,
        role: Roles.Admin,
        token: token,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(FAILED_TO_LOGIN, HttpStatus.BAD_REQUEST);
    }
  }
}
