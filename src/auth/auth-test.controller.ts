import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';

@Controller('auth-test')
export class AuthTestController {
  constructor(private readonly authService: AuthService) {}

  @Post('login-direct')
  async loginDirect(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
