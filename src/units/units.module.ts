import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
  imports: [PrismaModule, JwtModule],
})
export class UnitsModule {}
