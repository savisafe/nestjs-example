import { TokenService } from '../../token';
import { HttpException, HttpStatus } from '@nestjs/common';
import { YOU_DONT_OPPORTUNITY } from '../../consts';

export async function verifyAdminToken(
  token: string,
  tokenService: TokenService,
): Promise<{ id: string }> {
  try {
    return await tokenService.verifyToken(token);
  } catch {
    throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
  }
}
