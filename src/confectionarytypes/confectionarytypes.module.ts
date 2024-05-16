import { Module } from '@nestjs/common';
import { ConfectionaryTypesService } from './confectionarytypes.service';
import { ConfectionarytypesController } from './confectionarytypes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ConfectionarytypesController],
  providers: [ConfectionaryTypesService],
  exports: [ConfectionaryTypesService],
  imports: [PrismaModule, JwtModule],
})
export class ConfectionarytypesModule {}
