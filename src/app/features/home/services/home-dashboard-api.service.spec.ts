import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { HomeDashboardApiService } from './home-dashboard-api.service';
import { MOCK_DASHBOARD_FULL } from '../mocks/home-dashboard.mock';

describe('HomeDashboardApiService', () => {
  let service: HomeDashboardApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeDashboardApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HomeDashboardApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET /dashboard/aquariums and return the response', () => {
    service.getDashboard().subscribe((res) => {
      expect(res).toEqual(MOCK_DASHBOARD_FULL);
    });

    const req = httpMock.expectOne('http://localhost:3000/dashboard/aquariums');
    expect(req.request.method).toBe('GET');
    req.flush(MOCK_DASHBOARD_FULL);
  });
});
