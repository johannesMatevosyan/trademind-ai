// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
const normalizedJwtExpiresIn: number | StringValue = jwtAccessExpiresIn
  ? /^\d+$/.test(jwtAccessExpiresIn)
    ? Number(jwtAccessExpiresIn)
    : (jwtAccessExpiresIn as StringValue)
  : '15m';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'default_secret_key',
      signOptions: {
        expiresIn: normalizedJwtExpiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
