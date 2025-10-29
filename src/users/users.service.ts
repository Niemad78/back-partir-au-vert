import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserList } from './types';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  public async changeInformation(
    body: LoginDto,
    userId: string,
  ): Promise<void> {
    const utilisateurExistant = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    const emailExistant = await this.prismaService.user.findUnique({
      where: { email: body.email },
    });

    if (emailExistant?.email === body.email && emailExistant.id !== userId) {
      throw new UnauthorizedException('Cet email est déjà utilisé');
    }

    if (!utilisateurExistant) {
      throw new UnauthorizedException('Utilisateur inconnu');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        email: body.email,
        password: hashedPassword,
      },
    });

    return;
  }

  public async createNewUser(body: LoginDto): Promise<void> {
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
      },
    });

    return;
  }

  public async findAllUSers(): Promise<UserList[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  public async deleteUser(userId: string): Promise<LoginDto> {
    return this.prismaService.user.delete({
      where: { id: userId },
    });
  }
}
