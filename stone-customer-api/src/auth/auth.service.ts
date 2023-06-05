import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';

import { Observable, map } from 'rxjs';
import querystring from 'querystring';

@Injectable()
export class AuthService {
  constructor(private readonly httpService: HttpService) {}
  async signOn(username: string, pass: string): Promise<Observable<any>> {
    try {
      const body = {
        grant_type: 'client_credentials',
        client_id: 'customers',
        client_secret: '453000f7-47a0-4489-bc47-891c742650e2',
        username: 'bergsonjr@icloud.com',
        password: Buffer.from('bergsonjr@icloud.com').toString('base64'),
        scope: 'openid',
      };

      const data = this.httpService
        .post(
          '/auth/realms/careers/protocol/openid-connect/token',
          querystring.stringify(body),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        )
        .pipe(map((response) => response.data));

      return data;
    } catch (error) {
      throw new BadGatewayException(error);
    }
  }
}
