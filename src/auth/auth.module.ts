import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, UsersService],
})
export class AuthModule {}
