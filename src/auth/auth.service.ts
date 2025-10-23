import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { LoginProps, UserPayload } from './types';

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

    return this.authentificationUtilisateur({ userId: utilisateurExistant.id });
  }

  public async changePassword({ body }: LoginProps): Promise<void> {
    const { email, password: newPassword } = body;

    const utilisateurExistant = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!utilisateurExistant) {
      throw new UnauthorizedException('Utilisateur inconnu');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prismaService.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    return;
  }

  private async isValidePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private authentificationUtilisateur({ userId }: UserPayload): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }
}
