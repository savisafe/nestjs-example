import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import {
  FAILED_TO_ADMIN_DATA,
  FAILED_TO_LOGIN,
  FALED_TO_EXIT,
  SUCEES_TO_EXIT,
} from '../consts';
import { TokenService } from '../token';
import { IAdmin } from '../types';
import { setHead } from '../functions';

@Injectable()
export class AdminService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
  async getAdmin(response, request) {
    setHead(response);
    const token = request.cookies.token;
    if (!token)
      throw new HttpException(FAILED_TO_ADMIN_DATA, HttpStatus.BAD_REQUEST);
    const user = await this.tokenService.verifyToken(token);
    try {
      const { id, name } = await this.dataBase.admin.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          name: true,
        },
      });
      return {
        id,
        name,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(FAILED_TO_ADMIN_DATA, HttpStatus.BAD_REQUEST);
    }
  }
  async loginAdmin(data, response) {
    setHead(response);
    const { login, password } = data;
    try {
      const { id, name } = (await this.dataBase.admin.findFirst({
        where: {
          login,
          password,
        },
        select: {
          name: true,
          id: true,
        },
      })) as IAdmin;
      const token = await this.tokenService.generateJwtToken({
        id,
      });
      response.cookie('token', token);
      return {
        id,
        name,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(FAILED_TO_LOGIN, HttpStatus.BAD_REQUEST);
    }
  }
  async exitAdmin(response) {
    try {
      setHead(response);
      response.cookie('token', '');
      return { message: SUCEES_TO_EXIT, statusCode: HttpStatus.OK };
    } catch (error) {
      throw new HttpException(FALED_TO_EXIT, HttpStatus.BAD_REQUEST);
    }
  }
}
