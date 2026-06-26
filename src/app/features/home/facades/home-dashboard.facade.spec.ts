import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HomeDashboardFacade } from './home-dashboard.facade';
import { HomeDashboardMapper } from '../mappers/home-dashboard.mapper';
import { HomeDashboardMockService } from '../services/home-dashboard-mock.service';
import { MOCK_DASHBOARD_FULL, MOCK_DASHBOARD_EMPTY_AQUARIUMS } from '../mocks/home-dashboard.mock';

describe('HomeDashboardFacade', () => {
  let facade: HomeDashboardFacade;
  let mockService: jest.Mocked<HomeDashboardMockService>;

  beforeEach(() => {
    jest.useFakeTimers();

    const mockServiceSpy = {
      getDashboard: jest.fn().mockReturnValue(of(MOCK_DASHBOARD_FULL)),
    } as unknown as jest.Mocked<HomeDashboardMockService>;

    TestBed.configureTestingModule({
      providers: [
        HomeDashboardFacade,
        HomeDashboardMapper,
        { provide: HomeDashboardMockService, useValue: mockServiceSpy },
      ],
    });

    facade = TestBed.inject(HomeDashboardFacade);
    mockService = TestBed.inject(HomeDashboardMockService) as jest.Mocked<HomeDashboardMockService>;
  });

  afterEach(() => jest.useRealTimers());

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  describe('initial state', () => {
    it('loading should be false initially', () => {
      expect(facade.loading()).toBe(false);
    });

    it('error should be null initially', () => {
      expect(facade.error()).toBeNull();
    });

    it('hasAquariums should be false initially', () => {
      expect(facade.hasAquariums()).toBe(false);
    });

    it('aquariumCards should be empty initially', () => {
      expect(facade.aquariumCards()).toHaveLength(0);
    });

    it('selectedAquariumName should be null initially', () => {
      expect(facade.selectedAquariumName()).toBeNull();
    });

    it('list projections should be empty initially', () => {
      expect(facade.waterParameters()).toEqual([]);
      expect(facade.recentMeasurements()).toEqual([]);
      expect(facade.recentApplications()).toEqual([]);
    });
  });

  describe('loadDashboard', () => {
    it('sets loading to false after success', async () => {
      mockService.getDashboard.mockReturnValue(of(MOCK_DASHBOARD_FULL));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.loading()).toBe(false);
    });

    it('clears error on new load after failure', async () => {
      mockService.getDashboard.mockReturnValueOnce(throwError(() => new Error('fail')));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.error()).toBeTruthy();

      mockService.getDashboard.mockReturnValue(of(MOCK_DASHBOARD_FULL));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.error()).toBeNull();
    });

    it('populates aquariumCards after success', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.aquariumCards().length).toBeGreaterThan(0);
    });

    it('sets selectedAquariumId to first aquarium after load', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.selectedAquariumId()).toBe('aq-1');
    });

    it('sets hasAquariums true when aquariums exist', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.hasAquariums()).toBe(true);
    });

    it('sets hasAquariums false when no aquariums', async () => {
      mockService.getDashboard.mockReturnValue(of(MOCK_DASHBOARD_EMPTY_AQUARIUMS));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.hasAquariums()).toBe(false);
    });
  });

  describe('error state', () => {
    it('sets error message when service throws', async () => {
      mockService.getDashboard.mockReturnValue(throwError(() => new Error('API error')));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.error()).toBeTruthy();
      expect(typeof facade.error()).toBe('string');
    });

    it('sets loading to false after error', async () => {
      mockService.getDashboard.mockReturnValue(throwError(() => new Error('API error')));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.loading()).toBe(false);
    });
  });

  describe('selectAquarium', () => {
    const loadAndTick = async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
    };

    it('updates selectedAquariumId', async () => {
      await loadAndTick();
      facade.selectAquarium('aq-2');
      expect(facade.selectedAquariumId()).toBe('aq-2');
    });

    it('marks the selected card with selected: true', async () => {
      await loadAndTick();
      facade.selectAquarium('aq-3');
      const selected = facade.aquariumCards().find((c) => c.selected);
      expect(selected?.id).toBe('aq-3');
    });

    it('marks all other cards with selected: false', async () => {
      await loadAndTick();
      facade.selectAquarium('aq-2');
      const others = facade.aquariumCards().filter((c) => c.id !== 'aq-2');
      others.forEach((c) => expect(c.selected).toBe(false));
    });

    it('selectedAquariumName reflects the selected card title', async () => {
      await loadAndTick();
      facade.selectAquarium('aq-2');
      expect(facade.selectedAquariumName()).toBe('Paisagismo Plantado');
    });

    it('selectedAquariumName returns null when selected id does not match any card', async () => {
      await loadAndTick();
      facade.selectAquarium('missing-id');
      expect(facade.selectedAquariumName()).toBeNull();
    });
  });

  describe('retry', () => {
    it('calls loadDashboard again', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      const callCount = mockService.getDashboard.mock.calls.length;
      facade.retry();
      jest.runAllTimers();
      await Promise.resolve();
      expect(mockService.getDashboard.mock.calls.length).toBe(callCount + 1);
    });
  });

  describe('water parameters', () => {
    it('returns parameters after load', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.waterParameters().length).toBeGreaterThan(0);
    });

    it('no parameter has hasChartData: true (v1 mocks have empty series)', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      facade.waterParameters().forEach((p) => expect(p.hasChartData).toBe(false));
    });

    it('returns recent measurements after load', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.recentMeasurements().length).toBeGreaterThan(0);
    });

    it('returns recent applications after load', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.recentApplications().length).toBeGreaterThan(0);
    });

    it('recentMeasurements filters by selected aquarium', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();

      const aq1 = facade.recentMeasurements();
      facade.selectAquarium('aq-2');
      const aq2 = facade.recentMeasurements();

      expect(aq1).not.toEqual(aq2);
      aq1.forEach((m) => expect(m.aquariumId).toBe('aq-1'));
      aq2.forEach((m) => expect(m.aquariumId).toBe('aq-2'));
    });

    it('recentMeasurements limits to 5 items', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.recentMeasurements().length).toBeLessThanOrEqual(5);
    });

    it('recentApplications filters by selected aquarium', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();

      const aq1 = facade.recentApplications();
      facade.selectAquarium('aq-2');
      const aq2 = facade.recentApplications();

      expect(aq1).not.toEqual(aq2);
      aq1.forEach((a) => expect(a.aquariumId).toBe('aq-1'));
      aq2.forEach((a) => expect(a.aquariumId).toBe('aq-2'));
    });

    it('recentApplications limits to 5 items', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.recentApplications().length).toBeLessThanOrEqual(5);
    });
  });

  describe('measurementsByParamKey', () => {
    const loadAndTick = async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
    };

    it('groups measurements by parameterKey for the selected aquarium', async () => {
      await loadAndTick();
      const byKey = facade.measurementsByParamKey();
      expect(byKey['ph']).toBeDefined();
      expect(byKey['ph']!.length).toBeGreaterThan(0);
    });

    it('limits measurements per parameterKey to 3', async () => {
      await loadAndTick();
      const byKey = facade.measurementsByParamKey();
      Object.values(byKey).forEach((measurements) => {
        expect(measurements!.length).toBeLessThanOrEqual(3);
      });
    });

    it('excludes measurements from other aquariums', async () => {
      await loadAndTick();
      facade.selectAquarium('aq-2');
      const byKey = facade.measurementsByParamKey();
      // aq-1 has nitrite and ammonia; aq-2 does not
      expect(byKey['nitrite']).toBeUndefined();
      expect(byKey['ammonia']).toBeUndefined();
      // aq-2 has nitrate measurements
      expect(byKey['nitrate']).toBeDefined();
    });

    it('returns empty object when no measurements match the selected aquarium', async () => {
      mockService.getDashboard.mockReturnValue(of(MOCK_DASHBOARD_EMPTY_AQUARIUMS));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.measurementsByParamKey()).toEqual({});
    });

    it('overrides metadata with formatted date (DD/MM/YYYY)', async () => {
      await loadAndTick();
      const byKey = facade.measurementsByParamKey();
      const phMeasurements = byKey['ph'];
      expect(phMeasurements).toBeDefined();
      expect(phMeasurements![0].metadata).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
    });

    it('updates when selected aquarium changes', async () => {
      await loadAndTick();
      const before = Object.keys(facade.measurementsByParamKey());
      facade.selectAquarium('aq-3');
      const after = Object.keys(facade.measurementsByParamKey());
      expect(before).not.toEqual(after);
    });
  });
});
