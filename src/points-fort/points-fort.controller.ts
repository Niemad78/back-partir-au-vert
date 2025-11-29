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
import { PointsFortService } from './points-fort.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import type { PointsFortDto } from './points-fort.dto';

@Controller('points-fort')
export class PointsFortController {
  constructor(private readonly pointsFortService: PointsFortService) {}

  @Get('liste')
  async getAllPointsFort() {
    const result = await this.pointsFortService.findMany();

    return { ok: true, pointsFort: result };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPointFortById(
    @Param('id')
    id: string,
  ) {
    const result = await this.pointsFortService.findOne(id);

    return { ok: true, pointFort: result };
  }

  @Post('creation')
  @UseGuards(JwtAuthGuard)
  public async createPointFort(
    @Body()
    body: PointsFortDto,
  ) {
    const result = await this.pointsFortService.create(body);

    return { ok: true, pointFort: result };
  }

  @Put('modification/:id')
  @UseGuards(JwtAuthGuard)
  async updatePointFort(
    @Param('id')
    id: string,
    @Body()
    body: PointsFortDto,
  ) {
    const result = await this.pointsFortService.update(id, body);

    return { ok: true, pointFort: result };
  }

  @Delete('suppression/:id')
  @UseGuards(JwtAuthGuard)
  async deletePointFort(
    @Param('id')
    id: string,
  ) {
    await this.pointsFortService.delete(id);

    return { ok: true };
  }
}
