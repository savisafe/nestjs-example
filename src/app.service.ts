import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database';
@Injectable()
export class AppService {
  constructor(private readonly dataBase: DatabaseService) {}
}
