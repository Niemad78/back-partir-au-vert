import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LoginDto } from 'src/auth/auth.dto';
import { User } from './get-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('me/modify')
  public async modify(
    @User('userId') userId: string,
    @Body()
    body: LoginDto,
  ) {
    await this.usersService.changeInformation(body, userId);

    return { ok: true, message: 'Informations modifiées avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/verify')
  public me() {
    return { ok: true, message: 'Connexion réussie 🎉' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('new-user')
  public async newUser(
    @Body()
    body: LoginDto,
  ) {
    await this.usersService.createNewUser(body);

    return { ok: true, message: 'Utilisateur créé avec succès' };
  }
}
