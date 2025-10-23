import { Controller, Post, Body, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, PassportLoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'auth-service',
      environment: process.env.NODE_ENV || 'development'
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // Direct call to auth service without Passport
    return this.authService.login(loginDto);
  }

  // Simplified login endpoint for testing
  @Post('login-simple')
  async loginSimple(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
