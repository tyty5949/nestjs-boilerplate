import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { HomeController } from './home.controller';

@Module({
  imports: [CommonModule],
  controllers: [HomeController],
})
export class HomeModule {}
