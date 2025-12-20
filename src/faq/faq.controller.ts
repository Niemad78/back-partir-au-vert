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
import { FaqService } from './faq.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { FaqCreation, FaqModification } from './faq.dto';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('liste')
  async getAllFaq() {
    const result = await this.faqService.findMany();

    return { ok: true, faq: result };
  }

  @Get(':id')
  async getFaqById(
    @Param('id')
    id: string,
  ) {
    const result = await this.faqService.findOne(id);

    return { ok: true, faq: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createFaq(
    @Body()
    body: FaqCreation,
  ) {
    const result = await this.faqService.create(body);

    return { ok: true, faq: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('modification/:id')
  async updateFaq(
    @Param('id')
    id: string,
    @Body()
    body: FaqModification,
  ) {
    const result = await this.faqService.update(id, body);

    return { ok: true, faq: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  async deleteFaq(
    @Param('id')
    id: string,
  ) {
    await this.faqService.delete(id);

    return { ok: true };
  }
}
