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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ActivitesService } from './activites.service';
import type { ActiviteDto } from './activites.dto';

@UseGuards(JwtAuthGuard)
@Controller('activites')
export class ActivitesController {
  constructor(private readonly activitesService: ActivitesService) {}

  @Get('listes')
  async getAllActivites() {
    const result = await this.activitesService.findMany();

    return { ok: true, activites: result };
  }

  @Get(':id')
  async getActiviteById(
    @Param('id')
    id: string,
  ) {
    const result = await this.activitesService.findOne(id);

    return { ok: true, activite: result };
  }

  @Post('create')
  public async createActivite(
    @Body()
    body: ActiviteDto,
  ) {
    const result = await this.activitesService.create(body);

    return { ok: true, activite: result };
  }

  @Put('update/:id')
  async updateActivite(
    @Param('id')
    id: string,
    @Body()
    body: ActiviteDto,
  ) {
    const result = await this.activitesService.update(id, body);

    return { ok: true, activite: result };
  }

  @Delete('delete/:id')
  async deleteActivite(
    @Param('id')
    id: string,
  ) {
    await this.activitesService.delete(id);

    return { ok: true };
  }
}
