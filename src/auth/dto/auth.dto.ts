import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, ValidateIf } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(10)
  phone?: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ValidateIf(o => !o.phone)
  @IsEmail()
  email?: string;

  @ValidateIf(o => !o.email)
  @IsString()
  @MinLength(10)
  phone?: string;

  @IsString()
  password: string;
}

export class PassportLoginDto {
  @IsString()
  identifier: string; // Can be email or phone

  @IsString()
  password: string;
}
