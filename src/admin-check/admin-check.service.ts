import { DatabaseService } from '../database';
import { TokenService } from '../token';

export class AdminCheckService {
  constructor(
    private readonly dataBase: DatabaseService,
    private readonly tokenService: TokenService,
  ) {}
}
