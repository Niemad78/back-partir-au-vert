import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivitesModule } from './activites/activites.module';
import { ThemesModule } from './themes/themes.module';
import { PointsFortModule } from './points-fort/points-fort.module';
import { ImagesModule } from './images/images.module';
import { join } from 'path';
import { LoggingMiddleware } from './logging.middleware';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: {
        fallthrough: false,
      },
    }),
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
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
