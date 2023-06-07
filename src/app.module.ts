import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';

import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';

import AuthMiddleware from './auth/auth.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    HttpModule.register({ baseURL: 'https://accounts.seguros.vitta.com.br' }),
    RedisModule,
    CustomerModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('customer');
  }
}
