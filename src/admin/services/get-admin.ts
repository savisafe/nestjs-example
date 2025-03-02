import { TokenService } from '../../token';
import { DatabaseService } from '../../database';
import { setToken } from '../../functions';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FAILED_TO_ADMIN_DATA } from '../../consts';
import { IAdmin, Roles } from '../../types';

export async function getAdminData(
  request: Request,
  tokenService: TokenService,
  dataBase: DatabaseService,
) {
  const token: string = setToken(request);
  if (!token) {
    throw new HttpException(FAILED_TO_ADMIN_DATA, HttpStatus.UNAUTHORIZED);
  }
  const user: IAdmin = await tokenService.verifyToken(token);
  try {
    const { id } = await dataBase.admin.findUnique({
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
