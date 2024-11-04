import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  async generateJwtToken(token: object) {
    return this.jwtService.sign(token, {
      secret: process.env.SECRET_KEY_JWT,
      expiresIn: '20h',
    });
  }
  async verifyToken(token: string) {
    return this.jwtService.verify(token, {
      secret: process.env.SECRET_KEY_JWT,
    });
  }
}
