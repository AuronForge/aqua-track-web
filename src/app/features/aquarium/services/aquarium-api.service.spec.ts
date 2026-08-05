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
});
