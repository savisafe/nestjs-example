import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { JwtService } from '@nestjs/jwt';
import * as process from 'process';
import { HttpStatus } from '@nestjs/common';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;

  // Мокаем response
  const mockResponse = () => ({
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  });

  // Мокаем request
  const mockRequest = (token: string) => ({
    cookies: {
      token,
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService, DatabaseService, TokenService, JwtService],
    }).compile();

    categoriesService = moduleRef.get(CategoriesService);
    categoriesController = moduleRef.get(CategoriesController);
  });

  describe('get_categories', () => {
    it('Успешное получение категорий', async () => {
      const response = mockResponse();
      const request = mockRequest('token');
      await categoriesController.get_categories(response, request);
      expect(response.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        'http://localhost:3000',
      );
      expect(response.json).toHaveBeenCalledWith({
        categories: ['How_to', 'Privacy'],
        statusCode: HttpStatus.OK,
      });
    });
  });
});
