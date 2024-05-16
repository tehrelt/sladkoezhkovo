import { Module } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
  imports: [PrismaModule, JwtModule],
})
export class PackagesModule {}
