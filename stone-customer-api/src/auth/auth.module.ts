import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({ baseURL: 'https://accounts.seguros.vitta.com.br' }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
