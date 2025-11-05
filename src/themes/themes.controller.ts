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
import { ThemesService } from './themes.service';
import type { ThemeDto } from './themes.dto';

@UseGuards(JwtAuthGuard)
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get('listes')
  async getAllThemes() {
    const result = await this.themesService.findMany();

    return { ok: true, themes: result };
  }

  @Get(':id')
  async getThemeById(
    @Param('id')
    id: string,
  ) {
    const result = await this.themesService.findOne(id);

    return { ok: true, theme: result };
  }

  @Post('create')
  public async createTheme(
    @Body()
    body: ThemeDto,
  ) {
    const result = await this.themesService.create(body);

    return { ok: true, theme: result };
  }

  @Put('update/:id')
  async updateTheme(
    @Param('id')
    id: string,
    @Body()
    body: ThemeDto,
  ) {
    const result = await this.themesService.update(id, body);

    return { ok: true, theme: result };
  }

  @Delete('delete/:id')
  async deleteTheme(
    @Param('id')
    id: string,
  ) {
    await this.themesService.delete(id);

    return { ok: true, message: 'Thème supprimé avec succès' };
  }
}
