import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'identifier', // Generic field name
      passwordField: 'password',
    });
  }

  async validate(identifier: string, password: string) {
    // The identifier can be either email or phone
    // Let the auth service determine which one it is
    const user = await this.authService.login({
      email: identifier.includes('@') ? identifier : undefined,
      phone: identifier.includes('@') ? undefined : identifier,
      password
    });
    return user;
  }
}
