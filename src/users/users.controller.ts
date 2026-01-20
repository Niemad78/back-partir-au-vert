import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { UserCreation } from 'src/auth/auth.dto';
import { User } from './get-user.decorator';
import { Role } from 'src/role.enum';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('utilisateurs')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Put('me/modification')
  public async modify(
    @User('userId') userId: string,
    @Body()
    body: UserCreation,
  ) {
    await this.usersService.changeInformation(body, userId);

    return { ok: true, message: 'Informations modifiées avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/verification')
  public me() {
    return { ok: true, message: 'Connexion réussie 🎉' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/role')
  public role(@User('role') role: string) {
    return { ok: true, role };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('nouvel-utilisateur')
  @Roles(Role.SUPER_ADMIN)
  public async newUser(
    @Body()
    body: UserCreation,
  ) {
    await this.usersService.createNewUser(body);

    return { ok: true, message: 'Utilisateur créé avec succès' };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('liste')
  @Roles(Role.SUPER_ADMIN)
  public async listUsers() {
    const users = await this.usersService.findAllUSers();
    return { ok: true, users };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete('suppression/:userId')
  @Roles(Role.SUPER_ADMIN)
  public async deleteUser(
    @Param('userId')
    userId: string,
  ) {
    await this.usersService.deleteUser(userId);

    return { ok: true, message: 'Utilisateur supprimé avec succès' };
  }
}
