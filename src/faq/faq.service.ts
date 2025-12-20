import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FaqCreation, FaqOutput } from './faq.dto';

@Injectable()
export class FaqService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<FaqOutput[]> {
    return this.prismaService.faq.findMany();
  }

  async findOne(id: string): Promise<FaqOutput | null> {
    return this.prismaService.faq.findUnique({
      where: { id },
    });
  }

  async create(body: FaqCreation): Promise<FaqOutput> {
    return await this.prismaService.faq.create({
      data: body,
    });
  }

  async update(id: string, body: FaqCreation): Promise<FaqOutput> {
    return this.prismaService.faq.update({
      where: { id },
      data: body,
    });
  }

  async delete(id: string) {
    return this.prismaService.faq.delete({
      where: { id },
    });
  }
}
