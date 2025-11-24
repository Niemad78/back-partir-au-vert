import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivitesModule } from './activites/activites.module';
import { ThemesModule } from './themes/themes.module';
import { PointsFortModule } from './points-fort/points-fort.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    ActivitesModule,
    ThemesModule,
    PointsFortModule,
    ImagesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
