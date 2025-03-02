import { TokenService } from '../../token';
import { DatabaseService } from '../../database';
import { Roles } from '../../types';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FAILED_TO_LOGIN } from '../../consts';

export async function loginAdmin(
  data: { login: string; password: string },
  tokenService: TokenService,
  dataBase: DatabaseService,
) {
  const { login, password } = data;

  try {
    const { id } = await dataBase.admin.findUnique({
      where: {
        login,
        password,
      },
      select: {
        id: true,
        role: true,
      },
    });
    const token: string = await tokenService.generateJwtToken({ id });
    return {
      id,
      role: Roles.Admin,
      token,
      statusCode: HttpStatus.OK,
    };
  } catch (error) {
    throw new HttpException(FAILED_TO_LOGIN, HttpStatus.BAD_REQUEST);
  }
}
