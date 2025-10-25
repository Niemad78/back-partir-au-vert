import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body()
    body: LoginDto,
  ) {
    const token = await this.authService.login({ body });

    return { ok: true, token, message: 'Connexion réussie 🎉' };
  }
}
