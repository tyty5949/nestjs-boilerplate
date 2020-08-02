import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthApiController } from './auth.api-controller';
import { LocalStrategy } from './passport/local.strategy';
import { SessionSerializer } from './passport/session.serializer';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, UserModule],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthApiController],
  exports: [AuthService],
})
export class AuthModule {}
