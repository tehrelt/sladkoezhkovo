import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { AccountModule } from './account/account.module';
import { MinioModule } from './minio/minio.module';
import { CitiesModule } from './cities/cities.module';
import { ApplicationsModule } from './applications/applications.module';
import { MailerModule } from './mailer/mailer.module';
import { DistrictsModule } from './districts/districts.module';
import { PropertyTypesModule } from './propertytypes/propertytypes.module';
import { UnitsModule } from './units/units.module';
import { PackagesModule } from './packages/packages.module';
import { ConfectionarytypesModule } from './confectionarytypes/confectionarytypes.module';
import { FactoriesModule } from './factories/factories.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    RedisModule,
    UsersModule,
    AuthModule,
    LoggerModule,
    AccountModule,
    MinioModule,
    CitiesModule,
    ApplicationsModule,
    MailerModule,
    DistrictsModule,
    PropertyTypesModule,
    UnitsModule,
    PackagesModule,
    ConfectionarytypesModule,
    FactoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
