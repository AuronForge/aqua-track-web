import { TRANSLATIONS } from '../../../shared/constants/translations.constant';
import { AquariumListItemModel } from '../models/aquarium-list-item.model';
import { AquariumSummaryCardMapper } from './aquarium-summary-card.mapper';

const mapper = new AquariumSummaryCardMapper();

const MOCK_MODEL: AquariumListItemModel = {
  id: 'aq-test',
  name: 'Aquário Teste',
  aquariumType: 'COMMUNITY_TANK',
  waterType: 'FRESHWATER',
  subtitle: 'Água Doce',
  volumeLiters: 75,
  installedAmount: 2,
  installedUnit: 'YEAR',
  status: 'INACTIVE',
  recentParameters: [
    { key: 'ph', value: 7.2 },
    { key: 'temperature', value: 24 },
    { key: 'nitrate', value: 16 },
  ],
};

describe('AquariumSummaryCardMapper', () => {
  it('should map the aquarium model to a card view model', () => {
    const result = mapper.mapListItem(MOCK_MODEL, TRANSLATIONS.pt);

    expect(result).toMatchObject({
      id: 'aq-test',
      title: 'Aquário Teste',
      subtitle: 'Água Doce',
      status: 'attention',
      statusLabel: 'Inativo',
      volumeLabel: '75L',
      installedValue: '2 anos atrás',
      hasRecentParameters: true,
    });
    expect(result.recentParameters).toEqual([
      expect.objectContaining({ key: 'ph', label: 'pH', value: '7.2' }),
      expect.objectContaining({ key: 'temperature', label: 'Temp', value: '24°C' }),
      expect.objectContaining({ key: 'nitrate', label: 'NO3', value: '16' }),
    ]);
  });

  it('should use singular labels for one month and one year', () => {
    const singleMonth = mapper.mapListItem(
      { ...MOCK_MODEL, installedAmount: 1, installedUnit: 'MONTH' },
      TRANSLATIONS.pt,
    );
    const singleYear = mapper.mapListItem(
      { ...MOCK_MODEL, installedAmount: 1, installedUnit: 'YEAR' },
      TRANSLATIONS.pt,
    );

    expect(singleMonth.installedValue).toBe('1 mês atrás');
    expect(singleYear.installedValue).toBe('1 ano atrás');
  });

  it('should mark the card without recent parameters when the API does not provide them', () => {
    const result = mapper.mapListItem({ ...MOCK_MODEL, recentParameters: [] }, TRANSLATIONS.pt);

    expect(result.hasRecentParameters).toBe(false);
  });
});
