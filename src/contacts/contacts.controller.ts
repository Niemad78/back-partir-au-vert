import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ContactCreation } from './contacts.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  async getContact() {
    const result = await this.contactsService.findFirst();

    return { ok: true, contact: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification')
  async upsertContact(
    @Body()
    body: ContactCreation,
  ) {
    const result = await this.contactsService.upsert(body);

    return { ok: true, contact: result };
  }
}
