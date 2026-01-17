import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PartenairesService } from './partenaires.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { PartenaireCreation } from './partenaires.dto';

@Controller('partenaires')
export class PartenairesController {
  constructor(private readonly partenairesService: PartenairesService) {}

  @Get('liste')
  async getAllPartenaires() {
    const result = await this.partenairesService.findMany();

    return { ok: true, partenaires: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('creation')
  public async createPartenaire(
    @Body()
    body: PartenaireCreation,
  ) {
    const result = await this.partenairesService.create(body);

    return { ok: true, partenaire: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('suppression/:id')
  public async deletePartenaire(
    @Param('id')
    id: string,
  ) {
    await this.partenairesService.delete(id);

    return { ok: true };
  }
}
