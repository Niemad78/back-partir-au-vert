import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import type { ContactCreation, ContactOutput } from './contacts.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findFirst(): Promise<ContactOutput | null> {
    return this.prismaService.contact.findFirst();
  }

  async upsert(body: ContactCreation): Promise<ContactOutput> {
    const existing = await this.prismaService.contact.findFirst();

    if (existing) {
      return this.prismaService.contact.update({
        where: { id: existing.id },
        data: body,
      });
    }

    return this.prismaService.contact.create({
      data: body,
    });
  }
}
