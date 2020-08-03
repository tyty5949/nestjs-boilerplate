import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthApiController } from './controllers/auth.api-controller';
import { SessionSerializer } from './passport/session.serializer';
import { CommonModule } from '../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [CommonModule, UserModule, TypeOrmModule.forFeature([Session])],
  providers: [AuthService, SessionSerializer],
  controllers: [AuthApiController, AuthController],
  exports: [AuthService],
})
export class AuthModule {}
