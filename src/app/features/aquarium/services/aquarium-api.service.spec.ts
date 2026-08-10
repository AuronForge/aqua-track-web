import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AquariumApiService } from './aquarium-api.service';

describe('AquariumApiService', () => {
  let service: AquariumApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AquariumApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AquariumApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('gets the aquarium list without query string filters when none are provided', () => {
    service.listAquariums().subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.keys()).toEqual([]);
    req.flush([]);
  });

  it('gets the aquarium list with supported query string filters', () => {
    service
      .listAquariums({
        name: 'principal',
        type: 'COMMUNITY_TANK',
      })
      .subscribe();

    const req = httpMock.expectOne(
      'http://localhost:3000/aquariums?name=principal&type=COMMUNITY_TANK',
    );
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('posts the aquarium payload to the aquariums endpoint', () => {
    const payload = {
      name: 'Main Tank',
      description: 'Living room community aquarium',
      type: 'COMMUNITY',
      waterType: 'FRESHWATER' as const,
      volume: 200,
      volumeUnit: 'LITER' as const,
      setupDate: '2026-01-01T00:00:00.000Z',
      displayPreferences: {
        displayPH: true,
        displayGH: true,
        displayKH: true,
        displayNitrate: true,
        displayNitrite: true,
        displayAmmonia: true,
        displayTemperature: true,
        displayTDS: true,
        displayCopper: false,
        displayPhosphate: false,
        displayIron: false,
        displayCO2: true,
        displayO2: true,
        displayCalcium: false,
        displaySilicates: false,
        displayDensitySalinity: false,
        displayMagnesium: false,
        displayIodine: false,
        displayMolybdenum: false,
        displayStrontium: false,
        displayPotassium: true,
      },
      alertParameters: {
        displayPH: {
          minimumValue: 6.5,
          maximumValue: 7.5,
          targetValue: 7,
        },
      },
    };

    service.createAquarium(payload).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush({
      id: 'aq-1',
      ownerId: 'user-1',
      primaryPhotoUrl: null,
      photosCount: 0,
      status: 'ACTIVE',
      createdAt: '2026-07-16T19:20:03.239Z',
      updatedAt: '2026-07-16T19:20:03.239Z',
      deletedAt: null,
      ...payload,
    });
  });

  it('posts the aquarium photo as multipart form-data to the aquarium photos endpoint', () => {
    const file = new File(['fake-image-bytes'], 'aquarium.png', { type: 'image/png' });

    service.uploadAquariumPhoto('aq-1', file).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums/aq-1/photos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeInstanceOf(FormData);
    expect((req.request.body as FormData).get('photo')).toBe(file);
    req.flush(null);
  });

  it('gets a single aquarium by id', () => {
    service.getAquarium('aq-1').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums/aq-1');
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 'aq-1',
      ownerId: 'user-1',
      name: 'Main Tank',
      description: null,
      type: 'COMMUNITY',
      waterType: 'FRESHWATER',
      volume: 200,
      volumeUnit: 'LITER',
      setupDate: null,
      displayPreferences: {},
      alertParameters: {},
      primaryPhotoUrl: null,
      photosCount: 0,
      status: 'ACTIVE',
      createdAt: '2026-07-16T19:20:03.239Z',
      updatedAt: '2026-07-16T19:20:03.239Z',
      deletedAt: null,
    });
  });

  it('puts the complete aquarium payload to the aquarium detail endpoint', () => {
    const payload = {
      name: 'Updated Tank',
      description: null,
      type: 'COMMUNITY_TANK',
      waterType: 'FRESHWATER' as const,
      volume: 75,
      volumeUnit: 'LITER' as const,
      setupDate: null,
      displayPreferences: {
        displayPH: true,
        displayGH: false,
        displayKH: true,
        displayNitrate: true,
        displayNitrite: false,
        displayAmmonia: false,
        displayTemperature: true,
        displayTDS: false,
        displayCopper: false,
        displayPhosphate: false,
        displayIron: false,
        displayCO2: false,
        displayO2: false,
        displayCalcium: false,
        displaySilicates: false,
        displayDensitySalinity: false,
        displayMagnesium: false,
        displayIodine: false,
        displayMolybdenum: false,
        displayStrontium: false,
        displayPotassium: false,
      },
      alertParameters: {
        displayPH: {
          minimumValue: 6.5,
          maximumValue: 7.5,
          targetValue: 7,
        },
      },
    };

    service.updateAquarium('aq-1', payload).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums/aq-1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);
    expect(req.request.body.displayPreferences).toBe(payload.displayPreferences);
    expect(req.request.body.alertParameters).toBe(payload.alertParameters);
    req.flush({
      id: 'aq-1',
      ownerId: 'user-1',
      primaryPhotoUrl: null,
      photosCount: 0,
      status: 'ACTIVE',
      createdAt: '2026-07-16T19:20:03.239Z',
      updatedAt: '2026-07-16T19:20:03.239Z',
      deletedAt: null,
      ...payload,
    });
  });

  it('patches simple aquarium fields to the aquarium detail endpoint', () => {
    const payload = { name: 'Updated Tank' };

    service.patchAquarium('aq-1', payload).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums/aq-1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(payload);
    req.flush({
      id: 'aq-1',
      ownerId: 'user-1',
      name: 'Updated Tank',
      description: null,
      type: 'COMMUNITY',
      waterType: 'FRESHWATER',
      volume: 75,
      volumeUnit: 'LITER',
      setupDate: null,
      displayPreferences: {},
      alertParameters: {},
      primaryPhotoUrl: null,
      photosCount: 0,
      status: 'ACTIVE',
      createdAt: '2026-07-16T19:20:03.239Z',
      updatedAt: '2026-07-16T19:20:03.239Z',
      deletedAt: null,
    });
  });

  it('gets aquarium overview from the specific endpoint', () => {
    service.getAquariumOverview('aq-1').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums/aq-1/overview');
    expect(req.request.method).toBe('GET');
    req.flush({ health: { score: null, status: 'UNKNOWN' }, latestMeasurements: [] });
  });

  it('gets compatible water parameters by aquarium id', () => {
    service.listWaterParametersByAquarium('aq-1').subscribe();

    const req = httpMock.expectOne('http://localhost:3000/water-parameters/by-aquarium/aq-1');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('gets paginated aquarium measurements with supported query params', () => {
    service
      .listAquariumMeasurements('aq-1', {
        page: 1,
        pageSize: 10,
        parameter: 'ph',
        startDate: '2026-08-10T00:00:00.000Z',
        endDate: '2026-08-10T23:59:59.999Z',
        sort: 'measuredAt',
        direction: 'desc',
      })
      .subscribe();

    const req = httpMock.expectOne(
      'http://localhost:3000/aquariums/aq-1/measurements?page=1&pageSize=10&parameter=ph&startDate=2026-08-10T00:00:00.000Z&endDate=2026-08-10T23:59:59.999Z&sort=measuredAt&direction=desc',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 } });
  });

  it('posts a measurement using waterParameter key', () => {
    const payload = {
      waterParameter: 'ph',
      value: 7.2,
      measuredAt: '2026-08-10T12:00:00.000Z',
      notes: null,
    };

    service.createAquariumMeasurement('aq-1', payload).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums/aq-1/measurements');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });

  it('gets paginated aquarium applications with supported query params', () => {
    service
      .listAquariumApplications('aq-1', {
        page: 1,
        pageSize: 10,
        product: 'prime',
        type: 'Condicionador',
        sort: 'productName',
        direction: 'asc',
      })
      .subscribe();

    const req = httpMock.expectOne(
      'http://localhost:3000/aquariums/aq-1/applications?page=1&pageSize=10&product=prime&type=Condicionador&sort=productName&direction=asc',
    );
    expect(req.request.method).toBe('GET');
    req.flush({ data: [], pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 } });
  });

  it('posts an aquarium application snapshot request', () => {
    const payload = {
      productName: 'Prime',
      productType: 'Condicionador',
      dose: 5,
      doseUnit: 'ml',
      appliedAt: '2026-08-10T12:00:00.000Z',
      notes: null,
    };

    service.createAquariumApplication('aq-1', payload).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/aquariums/aq-1/applications');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(null);
  });
});
