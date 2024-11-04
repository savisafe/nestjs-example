import { IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  login: string;
  @IsNotEmpty()
  password: string;
}
