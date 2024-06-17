import { Module } from '@nestjs/common';
import { PropertyTypesService } from './propertytypes.service';
import { PropertyTypesController } from './propertytypes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService],
  exports: [PropertyTypesService],
  imports: [PrismaModule, JwtModule],
})
export class PropertyTypesModule {}
