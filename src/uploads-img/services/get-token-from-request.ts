import e from 'express';
import { setToken } from '../../functions';
import { HttpException, HttpStatus } from '@nestjs/common';
import { YOU_DONT_OPPORTUNITY } from '../../consts';

export function getTokenFromRequest(request: e.Request): string {
  const token = setToken(request);
  if (!token) {
    throw new HttpException(YOU_DONT_OPPORTUNITY, HttpStatus.FORBIDDEN);
  }
  return token;
}
