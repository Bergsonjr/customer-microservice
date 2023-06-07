import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Stone Customer Microservice', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/customer/{id} (GET)', () => {
    const existentCustomerId = 'd935016c-2723-436c-889c-5e2972963a0d';
    const existentCustomer = {
      document: '1231',
      name: 'é o berg update 2213231',
    };

    return request(app.getHttpServer())
      .get(`/customer/${existentCustomerId}`)
      .expect(200)
      .expect(existentCustomer);
  });

  it('/customer (POST)', () => {
    const newCustomer = {
      document: '12345678910',
      name: 'Bergson Junior',
    };

    return request(app.getHttpServer())
      .post(`/customer`)
      .expect(201)
      .expect('Hello World!');
  });

  it('/customer/{id} (PUT)', () => {
    const existentCustomerId = 'd935016c-2723-436c-889c-5e2972963a0d';
    const existentCustomer = {
      document: '1231',
      name: 'é o berg update 2213231',
    };
    return request(app.getHttpServer())
      .put(`/customer/${existentCustomerId}`)
      .expect(200)
      .expect(existentCustomer);
  });
});
