import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { setHead, setToken } from '../functions';
import {
  NOT_ADD_IMAGE,
  SUCCESS_ADD_IMAGE,
  YOU_DONT_OPPORTUNITY,
} from '../consts';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { Response, Request } from 'express';

@Injectable()
export class UploadsImgService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}

  async postImg(file, response: Response, request: Request) {
    setHead(response);

    try {
      const token = this.getTokenFromRequest(request);
      const adminId = await this.verifyAdminToken(token);

      await this.ensureAdminExists(adminId);

      return {
        message: SUCCESS_ADD_IMAGE,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  private getTokenFromRequest(request: Request): string {
    const token = setToken(request);
    if (!token) {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
    }
    return token;
  }

  private async verifyAdminToken(token: string): Promise<{ id: string }> {
    try {
      return await this.tokenService.verifyToken(token);
    } catch {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
    }
  }

  private async ensureAdminExists(adminId: { id: string }): Promise<void> {
    const admin = await this.dataBase.admin.findUnique({
      where: { id: adminId.id },
    });
    if (!admin) {
      throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
    }
  }

  private handleError(error) {
    if (error instanceof HttpException) {
      throw error;
    }
    throw new InternalServerErrorException(NOT_ADD_IMAGE, error);
  }
}
