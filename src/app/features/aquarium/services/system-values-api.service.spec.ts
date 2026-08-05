import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SystemValueApiDto } from '../models/system-value-api.dto';
import { SystemValuesApiService } from './system-values-api.service';

const mockResponse: SystemValueApiDto[] = [
  {
    id: '44444444-4444-4444-8444-444444444443',
    rootSystemValue: 'WATER_TYPE',
    systemValue: 'BRACKISH',
    description: 'Tipo de agua salobra.',
    displayValue: 'Brackish',
  },
  {
    id: '44444444-4444-4444-8444-444444444441',
    rootSystemValue: 'WATER_TYPE',
    systemValue: 'FRESHWATER',
    description: 'Tipo de agua doce.',
    displayValue: 'Freshwater',
  },
  {
    id: '44444444-4444-4444-8444-444444444442',
    rootSystemValue: 'WATER_TYPE',
    systemValue: 'SALTWATER',
    description: 'Tipo de agua salgada.',
    displayValue: 'Saltwater',
  },
];

describe('SystemValuesApiService', () => {
  let service: SystemValuesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SystemValuesApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SystemValuesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should GET /system-values with WATER_TYPE rootSystemValue', () => {
    service.listWaterTypes().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'http://localhost:3000/system-values' &&
        request.method === 'GET' &&
        request.params.get('rootSystemValue') === 'WATER_TYPE',
    );

    req.flush(mockResponse);
  });

  it('should GET /system-values with AQUARIUM_TYPE rootSystemValue', () => {
    service.listAquariumTypes().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      (request) =>
        request.url === 'http://localhost:3000/system-values' &&
        request.method === 'GET' &&
        request.params.get('rootSystemValue') === 'AQUARIUM_TYPE',
    );

    req.flush(mockResponse);
  });

  it('should share the same request across simultaneous subscribers', () => {
    const responses: SystemValueApiDto[][] = [];

    service.listAquariumTypes().subscribe((response) => responses.push(response));
    service.listAquariumTypes().subscribe((response) => responses.push(response));

    const req = httpMock.expectOne(
      (request) => request.params.get('rootSystemValue') === 'AQUARIUM_TYPE',
    );

    req.flush(mockResponse);

    expect(responses).toEqual([mockResponse, mockResponse]);
  });

  it('should return the cached response for repeated subscribers after success', () => {
    let firstResponse: SystemValueApiDto[] | undefined;
    let secondResponse: SystemValueApiDto[] | undefined;

    service.listAquariumTypes().subscribe((response) => {
      firstResponse = response;
    });

    httpMock
      .expectOne((request) => request.params.get('rootSystemValue') === 'AQUARIUM_TYPE')
      .flush(mockResponse);

    service.listAquariumTypes().subscribe((response) => {
      secondResponse = response;
    });

    httpMock.expectNone((request) => request.params.get('rootSystemValue') === 'AQUARIUM_TYPE');
    expect(firstResponse).toEqual(mockResponse);
    expect(secondResponse).toEqual(mockResponse);
  });

  it('should allow retrying after a failed request', () => {
    let firstError: HttpErrorResponse | undefined;
    let secondResponse: SystemValueApiDto[] | undefined;

    service.listAquariumTypes().subscribe({
      error: (error) => {
        firstError = error;
      },
    });

    httpMock
      .expectOne((request) => request.params.get('rootSystemValue') === 'AQUARIUM_TYPE')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    service.listAquariumTypes().subscribe((response) => {
      secondResponse = response;
    });

    httpMock
      .expectOne((request) => request.params.get('rootSystemValue') === 'AQUARIUM_TYPE')
      .flush(mockResponse);

    expect(firstError?.status).toBe(500);
    expect(secondResponse).toEqual(mockResponse);
  });

  it('should bypass the cache when forceRefresh is requested', () => {
    service.listAquariumTypes().subscribe();

    httpMock
      .expectOne((request) => request.params.get('rootSystemValue') === 'AQUARIUM_TYPE')
      .flush(mockResponse);

    service.listAquariumTypes({ forceRefresh: true }).subscribe();

    httpMock
      .expectOne((request) => request.params.get('rootSystemValue') === 'AQUARIUM_TYPE')
      .flush(mockResponse);
  });
});
