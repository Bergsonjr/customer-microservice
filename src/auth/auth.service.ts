import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  NestMiddleware,
  HttpStatus,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { stringify } from 'qs';

import { catchError, firstValueFrom } from 'rxjs';
import { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => HttpService))
    private readonly httpService: HttpService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new HttpException(`Missing authorization`, HttpStatus.FORBIDDEN);
    }

    const email = this.configService.get<string>('USERNAME');
    const emailInBase64 = Buffer.from(email).toString('base64');
    const body = {
      grant_type: 'client_credentials',
      client_id: this.configService.get<string>('CLIENT_ID'),
      client_secret: this.configService.get<string>('CLIENT_SECRET'),
      username: email,
      password: emailInBase64,
      scope: 'openid',
    };

    // Validate Token?
    await firstValueFrom(
      this.httpService
        .post(
          '/auth/realms/careers/protocol/openid-connect/token',
          stringify(body),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new HttpException(
              error.response?.statusText || 'SSO is unavailable',
              error.response?.status || 502,
            );
          }),
        ),
    );

    next();
  }
}
