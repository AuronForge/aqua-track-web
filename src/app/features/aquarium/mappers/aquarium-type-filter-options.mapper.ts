import { SelectFormfieldOption } from '../../../shared/components/formfields/select-formfield/select-formfield-option.model';
import { TranslationDictionary } from '../../../shared/types/translation-dictionary.type';
import { SystemValueApiDto } from '../models/system-value-api.dto';
import { resolveAquariumTypeLabel } from '../constants/aquarium-type-options.constant';

export function mapAquariumTypeFilterOptions(
  values: readonly SystemValueApiDto[],
  t: TranslationDictionary,
): SelectFormfieldOption[] {
  const options = new Map<string, SelectFormfieldOption>();

  for (const value of values) {
    if (value.rootSystemValue !== 'AQUARIUM_TYPE') {
      continue;
    }

    const systemValue = value.systemValue.trim();

    if (!systemValue || options.has(systemValue)) {
      continue;
    }

    const displayValue = value.displayValue.trim();
    const description = value.description?.trim();

    options.set(systemValue, {
      id: systemValue,
      title: resolveAquariumTypeLabel(systemValue, t, displayValue),
      subtitle: description || undefined,
    });
  }

  return [
    {
      id: null,
      title: t.homeAquariumFiltersTypePlaceholder,
    },
    ...Array.from(options.values()),
  ];
}
