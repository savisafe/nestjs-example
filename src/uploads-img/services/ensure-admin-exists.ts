import { HttpException, HttpStatus } from '@nestjs/common';
import { YOU_DONT_OPPORTUNITY } from '../../consts';
import { DatabaseService } from '../../database';

export async function ensureAdminExists(
  adminId: { id: string },
  dataBase: DatabaseService,
): Promise<void> {
  const admin = await dataBase.admin.findUnique({
    where: { id: adminId.id },
  });
  if (!admin) {
    throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
  }
}
