import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  public async changePassword(
    @Body()
    body: LoginDto,
  ) {
    await this.authService.changePassword({ body });

    return { ok: true, message: 'Mot de passe changé avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public me() {
    return { ok: true, message: 'Connexion réussie 🎉' };
  }
}
