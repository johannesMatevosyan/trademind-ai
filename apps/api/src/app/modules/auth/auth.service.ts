// auth.service.ts
import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  register(dto: RegisterDto) {
    return { message: 'Register endpoint works', email: dto.email };
  }

  login(dto: LoginDto) {
    return { message: 'Login endpoint works', email: dto.email };
  }
}
