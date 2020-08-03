import { Module } from '@nestjs/common';
import { makeDatabaseModule } from './database.module';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';
import { HomeModule } from './domain/home/home.module';

@Module({
  imports: [makeDatabaseModule(), UserModule, AuthModule, HomeModule],
})
export class AppModule {}
