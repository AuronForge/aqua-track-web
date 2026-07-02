import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HomeDashboardFacade } from './home-dashboard.facade';
import { HomeDashboardMapper } from '../mappers/home-dashboard.mapper';
import { HomeDashboardApiService } from '../services/home-dashboard-api.service';
import { MOCK_DASHBOARD_FULL, MOCK_DASHBOARD_EMPTY_AQUARIUMS } from '../mocks/home-dashboard.mock';

describe('HomeDashboardFacade', () => {
  let facade: HomeDashboardFacade;
  let apiService: jest.Mocked<HomeDashboardApiService>;

  beforeEach(() => {
    jest.useFakeTimers();

    const apiServiceSpy = {
      getDashboard: jest.fn().mockReturnValue(of(MOCK_DASHBOARD_FULL)),
    } as unknown as jest.Mocked<HomeDashboardApiService>;

    TestBed.configureTestingModule({
      providers: [
        HomeDashboardFacade,
        HomeDashboardMapper,
        { provide: HomeDashboardApiService, useValue: apiServiceSpy },
      ],
    });

    facade = TestBed.inject(HomeDashboardFacade);
    apiService = TestBed.inject(HomeDashboardApiService) as jest.Mocked<HomeDashboardApiService>;
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
      apiService.getDashboard.mockReturnValue(of(MOCK_DASHBOARD_FULL));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.loading()).toBe(false);
    });

    it('clears error on new load after failure', async () => {
      apiService.getDashboard.mockReturnValueOnce(throwError(() => new Error('fail')));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.error()).toBeTruthy();

      apiService.getDashboard.mockReturnValue(of(MOCK_DASHBOARD_FULL));
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
      apiService.getDashboard.mockReturnValue(of(MOCK_DASHBOARD_EMPTY_AQUARIUMS));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.hasAquariums()).toBe(false);
    });
  });

  describe('error state', () => {
    it('sets error message when service throws', async () => {
      apiService.getDashboard.mockReturnValue(throwError(() => new Error('API error')));
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.error()).toBeTruthy();
      expect(typeof facade.error()).toBe('string');
    });

    it('sets loading to false after error', async () => {
      apiService.getDashboard.mockReturnValue(throwError(() => new Error('API error')));
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
      const callCount = apiService.getDashboard.mock.calls.length;
      facade.retry();
      jest.runAllTimers();
      await Promise.resolve();
      expect(apiService.getDashboard.mock.calls.length).toBe(callCount + 1);
    });
  });

  describe('summaryParameters', () => {
    it('returns empty array when no aquarium is selected', () => {
      expect(facade.summaryParameters()).toEqual([]);
    });

    it('returns summary parameters for the selected aquarium after load', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.summaryParameters().length).toBeGreaterThan(0);
    });

    it('returns empty array when selected aquarium id does not match', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      facade.selectAquarium('non-existent-id');
      expect(facade.summaryParameters()).toEqual([]);
    });
  });

  describe('water parameters', () => {
    it('returns parameters for the selected aquarium after load', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.waterParameters().length).toBeGreaterThan(0);
    });

    it('no parameter has hasChartData: true (mocks have empty series)', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      facade.waterParameters().forEach((p) => expect(p.hasChartData).toBe(false));
    });

    it('returns empty waterParameters for unknown aquarium id', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      facade.selectAquarium('non-existent-id');
      expect(facade.waterParameters()).toEqual([]);
    });

    it('updates waterParameters when selected aquarium changes', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();

      const aq1Params = facade.waterParameters();
      facade.selectAquarium('aq-2');
      const aq2Params = facade.waterParameters();

      expect(aq1Params.length).not.toBe(aq2Params.length);
    });

    it('recentMeasurements returns measurements regardless of selected aquarium', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.recentMeasurements().length).toBeGreaterThan(0);

      const beforeCount = facade.recentMeasurements().length;
      facade.selectAquarium('aq-2');
      expect(facade.recentMeasurements().length).toBe(beforeCount);
    });

    it('recentApplications returns mapped application entries', async () => {
      facade.loadDashboard();
      jest.runAllTimers();
      await Promise.resolve();
      expect(facade.recentApplications().length).toBeGreaterThan(0);
      expect(facade.recentApplications()[0]).toMatchObject({
        title: expect.any(String),
        subtitle: expect.any(String),
      });
    });
  });
});
