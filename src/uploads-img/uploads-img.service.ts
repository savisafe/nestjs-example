import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { Request } from 'express';
import { SUCCESS_ADD_IMAGE, NOT_ADD_IMAGE } from '../consts';
import {
  getTokenFromRequest,
  verifyAdminToken,
  ensureAdminExists,
} from './services';

@Injectable()
export class UploadsImgService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async postImg(file: string, request: Request) {
    try {
      const token: string = getTokenFromRequest(request);
      const adminId: { id: string } = await verifyAdminToken(
        token,
        this.tokenService,
      );
      await ensureAdminExists(adminId, this.dataBase);

      return {
        message: SUCCESS_ADD_IMAGE,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: string | HttpException) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(NOT_ADD_IMAGE, error);
  }
}
