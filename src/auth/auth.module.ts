import { Module, forwardRef } from '@nestjs/common';
import AuthMiddleware from './auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [AuthMiddleware],
  exports: [AuthMiddleware],
  imports: [forwardRef(() => HttpModule)],
})
export class AuthModule {}
