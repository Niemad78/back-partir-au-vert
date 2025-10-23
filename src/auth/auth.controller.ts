import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './get-user.decorator';

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
  @Put('me/modify')
  public async modify(
    @User('userId') userId: string,
    @Body()
    body: LoginDto,
  ) {
    await this.authService.changeInformation(body, userId);

    return { ok: true, message: 'Informations modifiées avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/verify')
  public me() {
    return { ok: true, message: 'Connexion réussie 🎉' };
  }
}
