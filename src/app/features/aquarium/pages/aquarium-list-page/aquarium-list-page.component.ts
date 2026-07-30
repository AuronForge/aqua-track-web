import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  TemplateRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, merge, startWith, switchMap, tap } from 'rxjs';

import { PageTitleService } from '../../../../core/page-title/page-title.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SearchFormfieldComponent } from '../../../../shared/components/formfields/search-formfield/search-formfield.component';
import { SelectFormfieldOption } from '../../../../shared/components/formfields/select-formfield/select-formfield-option.model';
import { SelectFormfieldComponent } from '../../../../shared/components/formfields/select-formfield/select-formfield.component';
import { LanguageService } from '../../../../shared/services/language.service';
import { AquariumSummaryCardComponent } from '../../components/aquarium-summary-card/aquarium-summary-card.component';
import { mapAquariumApiToListItem } from '../../mappers/aquarium-list-item.mapper';
import { mapAquariumTypeFilterOptions } from '../../mappers/aquarium-type-filter-options.mapper';
import { AquariumSummaryCardMapper } from '../../mappers/aquarium-summary-card.mapper';
import { AquariumListResponseDto } from '../../models/aquarium-api.dto';
import { AquariumListItemModel } from '../../models/aquarium-list-item.model';
import { AquariumSummaryCardViewModel } from '../../models/aquarium-summary-card.view-model';
import { SystemValueApiDto } from '../../models/system-value-api.dto';
import { AquariumApiService } from '../../services/aquarium-api.service';
import { SystemValuesApiService } from '../../services/system-values-api.service';

@Component({
  selector: 'app-aquarium-list-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AquariumSummaryCardComponent,
    ButtonComponent,
    RouterLink,
    SearchFormfieldComponent,
    SelectFormfieldComponent,
  ],
  templateUrl: './aquarium-list-page.component.html',
  styleUrl: './aquarium-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AquariumListPageComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly pageTitleService = inject(PageTitleService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly languageService = inject(LanguageService);
  private readonly mapper = inject(AquariumSummaryCardMapper);
  private readonly aquariumApiService = inject(AquariumApiService);
  private readonly systemValuesApiService = inject(SystemValuesApiService);

  protected readonly t = this.languageService.translation;
  private readonly aquariumResponses = signal<readonly AquariumListResponseDto[]>([]);
  private readonly aquariumTypeValues = signal<readonly SystemValueApiDto[]>([]);
  protected readonly aquariumItems = computed<readonly AquariumListItemModel[]>(() =>
    this.aquariumResponses().map((aquarium) =>
      mapAquariumApiToListItem(aquarium, this.aquariumTypeValues()),
    ),
  );
  protected readonly aquariumsLoading = signal(true);
  protected readonly aquariumsError = signal(false);
  protected readonly aquariumTypeOptionsLoading = signal(true);
  protected readonly aquariumTypeOptionsError = signal(false);
  protected readonly filtersForm = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    aquariumType: new FormControl<string | null>(null),
  });
  private readonly filtersValue = toSignal(
    this.filtersForm.valueChanges.pipe(startWith(this.filtersForm.getRawValue())),
    { initialValue: this.filtersForm.getRawValue() },
  );

  protected readonly aquariumTypeOptions = computed<SelectFormfieldOption[]>(() =>
    mapAquariumTypeFilterOptions(this.aquariumTypeValues(), this.t()),
  );
  protected readonly aquariumTypeHint = computed(() => {
    if (this.aquariumTypeOptionsLoading()) {
      return this.t().aquariumListTypeLoadingHint;
    }

    if (this.aquariumTypeOptionsError()) {
      return this.t().aquariumListTypeLoadErrorHint;
    }

    return '';
  });

  protected readonly aquariums = computed<readonly AquariumSummaryCardViewModel[]>(() =>
    this.aquariumItems().map((aquarium) => this.mapper.mapListItem(aquarium, this.t())),
  );
  protected readonly hasAquariums = computed(() => this.aquariums().length > 0);
  protected readonly hasActiveFilters = computed(() => {
    const { search, aquariumType } = this.filtersValue();
    return (search ?? '').trim().length > 0 || aquariumType !== null;
  });
  protected readonly totalAquariums = computed(() => this.aquariumItems().length);
  protected readonly combinedVolumeLiters = computed(() =>
    this.aquariumItems().reduce((total, aquarium) => total + aquarium.volumeLiters, 0),
  );
  protected readonly totalAquariumsLabel = computed(() => {
    const count = this.totalAquariums();
    const aquariumLabel =
      count === 1 ? this.t().aquariumListAquariumSingular : this.t().aquariumListAquariumPlural;

    return `${this.t().aquariumListTotalLabel}: ${count} ${aquariumLabel}`;
  });
  protected readonly combinedVolumeLabel = computed(
    () => `${this.t().aquariumListCombinedVolumeLabel}: ${this.combinedVolumeLiters()}L`,
  );
  private readonly toolbarContentTemplate = viewChild<TemplateRef<unknown>>('toolbarContent');

  constructor() {
    effect(() => {
      this.pageTitleService.set(this.t().homeMyAquariums, this.t().homeMyAquariumsSubtitle);
    });

    effect(() => {
      const aquariumTypeControl = this.filtersForm.controls.aquariumType;

      if (this.aquariumTypeOptionsLoading()) {
        aquariumTypeControl.disable({ emitEvent: false });
        return;
      }

      if (aquariumTypeControl.disabled) {
        aquariumTypeControl.enable({ emitEvent: false });
      }
    });

    effect(() => {
      const selectedType = this.filtersValue().aquariumType ?? null;
      const hasSelectedType =
        selectedType === null ||
        this.aquariumTypeOptions().some((option) => option.id === selectedType);

      if (!hasSelectedType) {
        this.filtersForm.controls.aquariumType.setValue(null);
      }
    });
  }

  ngOnInit(): void {
    this.loadAquariumTypes();
    this.watchAquariums();
  }

  ngAfterViewInit(): void {
    this.pageTitleService.setToolbarContent(this.toolbarContentTemplate() ?? null);
  }

  ngOnDestroy(): void {
    this.pageTitleService.setToolbarContent(null);
  }

  protected retryAquariumTypes(): void {
    this.loadAquariumTypes(true);
  }

  protected retryAquariums(): void {
    this.fetchAquariums(this.filtersForm.getRawValue());
  }

  private watchAquariums(): void {
    merge(
      this.filtersForm.controls.search.valueChanges.pipe(debounceTime(400)),
      this.filtersForm.controls.aquariumType.valueChanges,
    )
      .pipe(
        startWith(null),
        map(() => ({
          search: (this.filtersForm.controls.search.getRawValue() ?? '').trim(),
          aquariumType: this.filtersForm.controls.aquariumType.getRawValue(),
        })),
        distinctUntilChanged(
          (previous, current) =>
            previous.search === current.search && previous.aquariumType === current.aquariumType,
        ),
        tap(() => {
          this.aquariumsLoading.set(true);
          this.aquariumsError.set(false);
        }),
        switchMap((filters) =>
          this.aquariumApiService.listAquariums({
            name: filters.search || undefined,
            type: filters.aquariumType,
          }),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (aquariums) => {
          this.aquariumResponses.set(aquariums);
          this.aquariumsLoading.set(false);
        },
        error: () => {
          this.aquariumResponses.set([]);
          this.aquariumsLoading.set(false);
          this.aquariumsError.set(true);
        },
      });
  }

  private fetchAquariums(formValue: { search: string; aquariumType: string | null }): void {
    this.aquariumsLoading.set(true);
    this.aquariumsError.set(false);

    this.aquariumApiService
      .listAquariums({
        name: formValue.search.trim() || undefined,
        type: formValue.aquariumType,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (aquariums) => {
          this.aquariumResponses.set(aquariums);
          this.aquariumsLoading.set(false);
        },
        error: () => {
          this.aquariumResponses.set([]);
          this.aquariumsLoading.set(false);
          this.aquariumsError.set(true);
        },
      });
  }

  private loadAquariumTypes(forceRefresh = false): void {
    this.aquariumTypeOptionsLoading.set(true);
    this.aquariumTypeOptionsError.set(false);

    this.systemValuesApiService
      .listAquariumTypes({ forceRefresh })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (values) => {
          this.aquariumTypeValues.set(values);
          this.aquariumTypeOptionsLoading.set(false);
        },
        error: () => {
          this.aquariumTypeValues.set([]);
          this.aquariumTypeOptionsLoading.set(false);
          this.aquariumTypeOptionsError.set(true);
        },
      });
  }
}
