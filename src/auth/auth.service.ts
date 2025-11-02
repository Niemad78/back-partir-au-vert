import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginProps, UserPayload } from './types';
import { Role } from 'src/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  public async login({ body }: LoginProps): Promise<string> {
    const { email, password } = body;

    const utilisateurExistant = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!utilisateurExistant) {
      throw new UnauthorizedException('Utilisateur inconnu');
    }

    const motDePasseValide = await this.isValidePassword(
      password,
      utilisateurExistant.password,
    );

    if (!motDePasseValide) {
      throw new UnauthorizedException('Mot de passe invalide');
    }

    return this.authentificationUtilisateur({
      userId: utilisateurExistant.id,
      role: utilisateurExistant.role,
    });
  }

  private async isValidePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private authentificationUtilisateur({ userId, role }: UserPayload): string {
    let roleFormate: string;
    switch (role) {
      case 'ADMIN':
        roleFormate = Role.ADMIN;
        break;
      case 'SUPER_ADMIN':
        roleFormate = Role.SUPER_ADMIN;
        break;
      default:
        throw new UnauthorizedException('Rôle utilisateur inconnu');
    }
    const payload = { sub: userId, role: roleFormate };
    return this.jwtService.sign(payload);
  }
}
