import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
} from '@nestjs/common';
import { PhonepeService } from './phonepe.service';
import { CreatePhonepeDto } from './dto/create-phonepe.dto';
import { UpdatePhonepeDto } from './dto/update-phonepe.dto';
import { Request } from 'express';

@Controller('phonepe')
export class PhonepeController {
  constructor(private readonly phonepeService: PhonepeService) {}

  @Post('pay-page')
  getPayPage(@Body() body: { userId: string; amount: string }) {
    return this.phonepeService.getPayPage(body.userId, body.amount);
  }

  @Get('check-status/:transactionId/:userId')
  checkStatus(
    @Req() req: Request,
    @Res() res,
    @Param('transactionId') transactionId: string,
    @Param('userId') userId: string,
  ) {
    console.log(req.headers);
    return this.phonepeService.checkStatus(res, transactionId, userId);
  }

  @Get('get-status/:transactionId')
  getStatus(@Param('transactionId') transactionId: string) {
    return this.phonepeService.getStatus(transactionId);
  }
}
