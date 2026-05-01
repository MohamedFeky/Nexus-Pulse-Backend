import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, LoginDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerData: CreateAuthDto) {
    return this.authService.register(registerData);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }
}
