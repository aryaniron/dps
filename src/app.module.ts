import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PhonepeModule } from './phonepe/phonepe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PhonepeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
