import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { HomeDashboardMockService } from './home-dashboard-mock.service';
import { DashboardApiDto } from '../models';

describe('HomeDashboardMockService', () => {
  let service: HomeDashboardMockService;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({ providers: [HomeDashboardMockService] });
    service = TestBed.inject(HomeDashboardMockService);
  });

  afterEach(() => jest.useRealTimers());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getDashboard should return an Observable', () => {
    const result = service.getDashboard();
    expect(result).toBeDefined();
    expect(typeof result.subscribe).toBe('function');
  });

  it('getDashboard should emit a DashboardApiDto with all required fields', async () => {
    const promise = firstValueFrom(service.getDashboard());
    jest.runAllTimers();
    const dto: DashboardApiDto = await promise;

    expect(dto).toBeDefined();
    expect(Array.isArray(dto.aquariums)).toBe(true);
    expect(Array.isArray(dto.waterParameters)).toBe(true);
    expect(Array.isArray(dto.recentMeasurements)).toBe(true);
    expect(Array.isArray(dto.recentApplications)).toBe(true);
    expect(dto.summary).toBeDefined();
    expect(typeof dto.summary.totalAquariums).toBe('number');
  });

  it('getDashboard should emit multiple aquariums in FULL mock', async () => {
    const promise = firstValueFrom(service.getDashboard());
    jest.runAllTimers();
    const dto = await promise;

    expect(dto.aquariums.length).toBeGreaterThan(0);
    dto.aquariums.forEach((aq) => {
      expect(aq.id).toBeTruthy();
      expect(aq.name).toBeTruthy();
      expect(aq.healthStatus).toMatch(/^(STABLE|ATTENTION|CRITICAL|UNKNOWN)$/);
    });
  });

  it('getDashboard should emit after a delay', async () => {
    let emitted = false;
    service.getDashboard().subscribe(() => (emitted = true));

    expect(emitted).toBe(false);
    jest.runAllTimers();
    await Promise.resolve();
    expect(emitted).toBe(true);
  });

  it('getDashboardError should emit an error', async () => {
    let error: Error | null = null;

    const promise = firstValueFrom(service.getDashboardError()).catch((e: Error) => {
      error = e;
    });
    jest.runAllTimers();
    await promise;

    expect(error).toBeTruthy();
    expect((error as Error).message).toContain('Simulated API error');
  });
});
