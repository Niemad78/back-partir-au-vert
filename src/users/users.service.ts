import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UtilisateurOutput } from './types';
import { EmailDto, InfoDto, PasswordDto, UserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public async findMany(): Promise<UtilisateurOutput[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
      },
    });
  }

  async findOne(id: string): Promise<UtilisateurOutput | null> {
    return this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
      },
    });
  }

  public async create(body: UserDto): Promise<void> {
    const emailExistant = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (emailExistant) {
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.prismaService.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        nom: body.nom,
        prenom: body.prenom,
      },
    });

    return;
  }

  public async updateEmail(
    body: EmailDto,
    id: string,
  ): Promise<UtilisateurOutput> {
    const utilisateurExistant = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!utilisateurExistant) {
      throw new UnauthorizedException('Utilisateur inconnu');
    }

    const emailExistant = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (emailExistant) {
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }

    return this.prismaService.user.update({
      where: { id },
      data: {
        email: body.email,
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
      },
    });
  }

  public async updatePassword(
    body: PasswordDto,
    id: string,
  ): Promise<UtilisateurOutput> {
    const utilisateurExistant = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!utilisateurExistant) {
      throw new UnauthorizedException('Utilisateur inconnu');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    return await this.prismaService.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
      },
    });
  }

  public async updateInfo(
    body: InfoDto,
    id: string,
  ): Promise<UtilisateurOutput> {
    const utilisateurExistant = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!utilisateurExistant) {
      throw new UnauthorizedException('Utilisateur inconnu');
    }

    return await this.prismaService.user.update({
      where: { id },
      data: {
        nom: body.nom,
        prenom: body.prenom,
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
      },
    });
  }

  public async deleteUser(userId: string): Promise<LoginDto> {
    return this.prismaService.user.delete({
      where: { id: userId },
    });
  }
}
