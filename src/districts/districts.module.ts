import { Module } from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { DistrictsController } from './districts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [DistrictsController],
  providers: [DistrictsService],
  exports: [DistrictsService],
  imports: [PrismaModule, JwtModule],
})
export class DistrictsModule {}
