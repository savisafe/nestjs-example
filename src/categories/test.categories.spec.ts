import { Test } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseService } from '../database';
import { TokenService } from '../token';
import { JwtService } from '@nestjs/jwt';

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let categoriesService: CategoriesService;
  const mockResponse = () => ({
    setHeader: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  });
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
  it('Открытие контроллера', () => {
    expect(categoriesController).toBeDefined();
  });
});
