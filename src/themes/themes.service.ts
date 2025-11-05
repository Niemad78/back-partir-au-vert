import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ThemeDto, ThemeOutput } from './themes.dto';

@Injectable()
export class ThemesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<ThemeOutput[]> {
    return this.prismaService.theme.findMany();
  }

  async findOne(id: string): Promise<ThemeOutput | null> {
    return this.prismaService.theme.findUnique({
      where: { id },
    });
  }

  async create(body: ThemeDto): Promise<ThemeOutput> {
    return await this.prismaService.theme.create({
      data: body,
    });
  }

  async update(id: string, body: ThemeDto): Promise<ThemeOutput> {
    return this.prismaService.theme.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: string) {
    return this.prismaService.theme.delete({
      where: { id },
    });
  }
}
