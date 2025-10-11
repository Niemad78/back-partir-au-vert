import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User } from './type';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });
  }

  async findOneById(userId: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });
  }
}
