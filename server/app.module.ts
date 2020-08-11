import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';
import { HomeModule } from './domain/home/home.module';
import { NestConfigModule } from './config';

@Module({
  imports: [
    // Helper modules
    DatabaseModule,
    NestConfigModule,

    // Domain modules
    UserModule,
    AuthModule,
    HomeModule,
  ],
})
export class AppModule {}
