import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { HttpStatus } from '@nestjs/common';
import { AdminLoginDto } from './dto';
import { Roles } from '../types';

describe('AdminController', () => {
  let controller: AdminController;
  let adminService: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            getAdmin: jest.fn(),
            loginAdmin: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    adminService = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get_admin', () => {
    it('should call getAdmin method of AdminService', async () => {
      const mockRequest = {} as Request;
      const mockResult = {
        id: '1',
        role: Roles.Admin,
        statusCode: HttpStatus.OK,
      };

      jest.spyOn(adminService, 'getAdmin').mockResolvedValue(mockResult);

      const result = await controller.get_admin(mockRequest);

      expect(adminService.getAdmin).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResult);
    });
  });

  describe('login_admin', () => {
    it('should call loginAdmin method of AdminService', async () => {
      const mockDto: AdminLoginDto = { login: 'admin', password: 'password' };
      const mockResult = {
        id: '1',
        role: Roles.Admin,
        token: 'token',
        statusCode: HttpStatus.OK,
      };

      jest.spyOn(adminService, 'loginAdmin').mockResolvedValue(mockResult);

      const result = await controller.login_admin(mockDto);

      expect(adminService.loginAdmin).toHaveBeenCalledWith(mockDto);
      expect(result).toEqual(mockResult);
    });
  });
});
