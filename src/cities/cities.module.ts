import { Module } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService],
  imports: [PrismaModule, JwtModule],
  exports: [CitiesService, PrismaModule],
})
export class CitiesModule {}
