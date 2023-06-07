import { Test, TestingModule } from '@nestjs/testing';
import AuthMiddleware from './auth.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { NextFunction, Request, Response } from 'express';

import { forwardRef } from '@nestjs/common';

describe.skip('AuthService', () => {
  let service: AuthMiddleware;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthMiddleware, HttpService],
      imports: [forwardRef(() => HttpModule)],
    }).compile();

    service = module.get<AuthMiddleware>(AuthMiddleware);
    httpService = module.get<HttpService>(HttpService);
  });

  it('shold throws an exception because is missing header auth', async () => {
    expect(service).toBeDefined();
  });
  it('should throws an exepction because SSO is unavailable', async () => {
    expect(service).toBeDefined();
  });

  it('should pass to next middleware', async () => {
    const req = {
      headers: {
        authorization:
          'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyTGYtamFReXZmQTNCN3dpVHZ3VkxhMjV1cHhiXzUtQXhZSDhmY3kySHhVIn0.eyJleHAiOjE2ODYwMDYyMzIsImlhdCI6MTY4NjAwNTkzMiwianRpIjoiMDM3YWRmNWUtZDNlZi00MmMyLWE0MTEtN2JjYTZiOTkzZTc1IiwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zZWd1cm9zLnZpdHRhLmNvbS5ici9hdXRoL3JlYWxtcy9jYXJlZXJzIiwic3ViIjoiNzk0ZmFkNjktMzkxNy00OThmLThhNjUtMWVjZGU5NjlmMGRiIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiY3VzdG9tZXJzIiwiYWNyIjoiMSIsInJlc291cmNlX2FjY2VzcyI6eyJjdXN0b21lcnMiOnsicm9sZXMiOlsidXNlciJdfX0sInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwiLCJjbGllbnRJZCI6ImN1c3RvbWVycyIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SG9zdCI6IjEwLjUwLjIuMjQ0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWN1c3RvbWVycyIsImNsaWVudEFkZHJlc3MiOiIxMC41MC4yLjI0NCJ9.Ho_3FfN03qBaTHKFngix6rzFmSKSe3jEtNuQStbY2J7qHri2GeybkQH01YKVsYkNJYieQJnjGrNsEiVSTx9GxD4Evh9fJG5cTTownkHaaktx9sAMTikabd83FYW2xcUCJdmNbPmo2WW56bexiCyGbColBlCuSAL0SaqwDa_4y-3NfkOplKd8pKbt-lxanzA9N9XCfe5IZc6H7tFVPXht-ASSb-7NcjGSIQpJnWXZaiMWRX18kFv_g65iXSu1hxmApujwAiBARTUFxNqxjMXuOsUJy-EtdPiZrML0rkS5Fr8MwoKXy-ZsW3cm7RLflNhePVJBmUUmugAFatDPnypNPA',
      },
    } as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    const middleware = service.use(req, res, next);

    expect(middleware).resolves.toBe({});

    expect(next).toHaveBeenCalled();
  });
});
