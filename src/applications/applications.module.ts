import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
  imports: [PrismaModule, UsersModule, AuthModule, MailerModule],
})
export class ApplicationsModule {}
