import { Module } from '@nestjs/common';
import { PhonepeService } from './phonepe.service';
import { PhonepeController } from './phonepe.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PhonepeController],
  providers: [PhonepeService],
})
export class PhonepeModule {}
