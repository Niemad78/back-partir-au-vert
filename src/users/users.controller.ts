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
import { User } from './get-user.decorator';
import { Role } from 'src/role.enum';
import { Roles } from 'src/auth/role.decorator';
import { RolesGuard } from 'src/auth/role.guard';
import { EmailDto, InfoDto, PasswordDto, UserDto } from './users.dto';

@Controller('utilisateurs')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('liste')
  @Roles(Role.SUPER_ADMIN)
  public async getAllUtilisateurs() {
    const users = await this.usersService.findMany();
    return { ok: true, users };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  public async getUtilisateurById(@User('userId') userId: string) {
    const user = await this.usersService.findOne(userId);
    return { ok: true, user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/verification')
  public me() {
    return { ok: true, message: 'Vous êtes connecté' };
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
    body: UserDto,
  ) {
    await this.usersService.create(body);

    return { ok: true, message: 'Utilisateur créé avec succès' };
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/email')
  public async updateEmail(
    @User('userId') userId: string,
    @Body()
    body: EmailDto,
  ) {
    const result = await this.usersService.updateEmail(body, userId);

    return { ok: true, utilisateur: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/password')
  public async updatePassword(
    @User('userId') userId: string,
    @Body()
    body: PasswordDto,
  ) {
    const result = await this.usersService.updatePassword(body, userId);

    return { ok: true, utilisateur: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('me/infos')
  public async updateInfo(
    @User('userId') userId: string,
    @Body()
    body: InfoDto,
  ) {
    const result = await this.usersService.updateInfo(body, userId);

    return { ok: true, utilisateur: result };
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
