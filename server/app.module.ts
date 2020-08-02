import { Module } from '@nestjs/common';
import { makeDatabaseModule } from './database.module';
import { UserModule } from './domain/user/user.module';
import { AuthModule } from './domain/auth/auth.module';

@Module({
  imports: [makeDatabaseModule(), UserModule, AuthModule],
})
export class AppModule {}
