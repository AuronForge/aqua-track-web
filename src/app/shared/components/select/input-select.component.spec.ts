import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';

import { InputSelectChangeEvent } from './input-select-change-event.model';
import { InputSelectOption } from './input-select-option.model';
import { InputSelectComponent } from './input-select.component';

const MOCK_OPTIONS: InputSelectOption[] = [
  { id: '1', title: 'Opção Um', subtitle: 'Subtítulo 1', icon: 'water_drop' },
  { id: '2', title: 'Opção Dois', subtitle: 'Subtítulo 2', icon: 'water_drop' },
  { id: '3', title: 'Opção Desabilitada', disabled: true },
];

@Component({
  standalone: true,
  imports: [InputSelectComponent],
  template: `
    <aq-input-select
      [options]="options()"
      [selectedOption]="selectedOption()"
      [placeholder]="placeholder()"
      [disabled]="disabled()"
      [loading]="loading()"
      (selectionChange)="onSelectionChange($event)"
    />
  `,
})
class TestHostComponent {
  readonly options = signal<InputSelectOption[]>(MOCK_OPTIONS);
  readonly selectedOption = signal<InputSelectOption | null>(null);
  readonly placeholder = signal<string>('Selecione');
  readonly disabled = signal<boolean>(false);
  readonly loading = signal<boolean>(false);
  readonly lastChange = signal<InputSelectChangeEvent | null>(null);

  onSelectionChange(event: InputSelectChangeEvent): void {
    this.lastChange.set(event);
  }
}

describe('InputSelectComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let overlayContainer: OverlayContainer;
  let overlayEl: HTMLElement;

  function host(): TestHostComponent {
    return hostFixture.componentInstance;
  }

  function component(): InputSelectComponent {
    return hostFixture.debugElement.children[0].componentInstance as InputSelectComponent;
  }

  function hostEl(): HTMLElement {
    return hostFixture.nativeElement.querySelector('aq-input-select') as HTMLElement;
  }

  function trigger(): HTMLButtonElement {
    return hostFixture.nativeElement.querySelector('.input-select__trigger') as HTMLButtonElement;
  }

  function dropdown(): HTMLElement | null {
    return overlayEl.querySelector('.input-select__dropdown');
  }

  function options(): NodeListOf<HTMLElement> {
    return overlayEl.querySelectorAll('.input-select__option');
  }

  function clickTrigger(): void {
    trigger().click();
    hostFixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    overlayContainer = TestBed.inject(OverlayContainer);
    overlayEl = overlayContainer.getContainerElement();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component()).toBeTruthy();
  });

  // ── Trigger rendering ─────────────────────────────────────────────────────

  it('should render the placeholder when no option is selected', () => {
    expect(trigger().textContent).toContain('Selecione');
  });

  it('should render the selected option title when one is provided', () => {
    host().selectedOption.set(MOCK_OPTIONS[0]);
    hostFixture.detectChanges();

    expect(trigger().textContent).toContain('Opção Um');
  });

  it('should render the selected option icon when present', () => {
    host().selectedOption.set(MOCK_OPTIONS[0]);
    hostFixture.detectChanges();

    const icon = hostFixture.nativeElement.querySelector('.input-select__trigger-icon');
    expect(icon).toBeTruthy();
    expect(icon.textContent).toContain('water_drop');
  });

  it('should not render the trigger icon when selected option has no icon', () => {
    host().selectedOption.set({ id: '99', title: 'Sem ícone' });
    hostFixture.detectChanges();

    expect(hostFixture.nativeElement.querySelector('.input-select__trigger-icon')).toBeNull();
  });

  // ── ARIA on trigger ───────────────────────────────────────────────────────

  it('should have aria-expanded="false" when closed', () => {
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
  });

  it('should have aria-haspopup="listbox"', () => {
    expect(trigger().getAttribute('aria-haspopup')).toBe('listbox');
  });

  // ── Host class ────────────────────────────────────────────────────────────

  it('should always have base input-select class', () => {
    expect(hostEl().classList).toContain('input-select');
  });

  it('should have input-select--medium class by default', () => {
    expect(hostEl().classList).toContain('input-select--medium');
  });

  // ── Open / Close ──────────────────────────────────────────────────────────

  it('should open the dropdown on trigger click', () => {
    clickTrigger();
    expect(dropdown()).toBeTruthy();
  });

  it('should close the dropdown on second trigger click', () => {
    clickTrigger();
    clickTrigger();
    expect(dropdown()).toBeNull();
  });

  it('should apply input-select--open class when open', () => {
    clickTrigger();
    expect(hostEl().classList).toContain('input-select--open');
  });

  it('should remove input-select--open class when closed', () => {
    clickTrigger();
    clickTrigger();
    expect(hostEl().classList).not.toContain('input-select--open');
  });

  it('should set aria-expanded="true" when open', () => {
    clickTrigger();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
  });

  // ── Options rendering ─────────────────────────────────────────────────────

  it('should render all options when open', () => {
    clickTrigger();
    expect(options()).toHaveLength(MOCK_OPTIONS.length);
  });

  it('should render option titles', () => {
    clickTrigger();
    expect(options()[0].textContent).toContain('Opção Um');
  });

  it('should render option subtitles when present', () => {
    clickTrigger();
    const subtitle = options()[0].querySelector('.input-select__option-subtitle');
    expect(subtitle?.textContent).toContain('Subtítulo 1');
  });

  it('should apply disabled class to disabled options', () => {
    clickTrigger();
    expect(options()[2].classList).toContain('input-select__option--disabled');
  });

  it('should set aria-disabled on disabled options', () => {
    clickTrigger();
    expect(options()[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('should not set aria-disabled on enabled options', () => {
    clickTrigger();
    expect(options()[0].getAttribute('aria-disabled')).toBeNull();
  });

  // ── Empty state ───────────────────────────────────────────────────────────

  it('should show empty state when options list is empty', () => {
    host().options.set([]);
    hostFixture.detectChanges();
    clickTrigger();

    expect(overlayEl.querySelector('.input-select__empty')).toBeTruthy();
    expect(overlayEl.querySelector('.input-select__list')).toBeNull();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it('should not open when loading is true', () => {
    host().loading.set(true);
    hostFixture.detectChanges();
    clickTrigger();

    expect(dropdown()).toBeNull();
  });

  // ── Selection ─────────────────────────────────────────────────────────────

  it('should apply selected class to the matching option', () => {
    host().selectedOption.set(MOCK_OPTIONS[0]);
    hostFixture.detectChanges();
    clickTrigger();

    expect(options()[0].classList).toContain('input-select__option--selected');
    expect(options()[1].classList).not.toContain('input-select__option--selected');
  });

  it('should set aria-selected="true" on the selected option', () => {
    host().selectedOption.set(MOCK_OPTIONS[1]);
    hostFixture.detectChanges();
    clickTrigger();

    expect(options()[1].getAttribute('aria-selected')).toBe('true');
    expect(options()[0].getAttribute('aria-selected')).toBe('false');
  });

  it('should emit selectionChange with correct option and null previousOption', () => {
    clickTrigger();
    options()[0].click();
    hostFixture.detectChanges();

    expect(host().lastChange()?.option).toEqual(MOCK_OPTIONS[0]);
    expect(host().lastChange()?.previousOption).toBeNull();
  });

  it('should emit selectionChange with the correct previousOption', () => {
    host().selectedOption.set(MOCK_OPTIONS[0]);
    hostFixture.detectChanges();
    clickTrigger();

    options()[1].click();
    hostFixture.detectChanges();

    expect(host().lastChange()?.option).toEqual(MOCK_OPTIONS[1]);
    expect(host().lastChange()?.previousOption).toEqual(MOCK_OPTIONS[0]);
  });

  it('should close the dropdown after selecting an option', () => {
    clickTrigger();
    options()[0].click();
    hostFixture.detectChanges();

    expect(dropdown()).toBeNull();
  });

  it('should not emit selectionChange when clicking a disabled option', () => {
    clickTrigger();
    options()[2].click();
    hostFixture.detectChanges();

    expect(host().lastChange()).toBeNull();
    expect(dropdown()).toBeTruthy();
  });

  // ── Disabled component ────────────────────────────────────────────────────

  it('should not open when disabled', () => {
    host().disabled.set(true);
    hostFixture.detectChanges();
    clickTrigger();

    expect(dropdown()).toBeNull();
  });

  it('should apply input-select--disabled class when disabled', () => {
    host().disabled.set(true);
    hostFixture.detectChanges();

    expect(hostEl().classList).toContain('input-select--disabled');
  });

  it('should set aria-disabled on the trigger when disabled', () => {
    host().disabled.set(true);
    hostFixture.detectChanges();

    expect(trigger().getAttribute('aria-disabled')).toBe('true');
  });

  // ── Keyboard — open ───────────────────────────────────────────────────────

  it('should open on Enter key when closed', () => {
    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    hostFixture.detectChanges();

    expect(dropdown()).toBeTruthy();
  });

  it('should open on Space key when closed', () => {
    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    hostFixture.detectChanges();

    expect(dropdown()).toBeTruthy();
  });

  // ── Keyboard — navigate and close ────────────────────────────────────────

  it('should close on Escape key', () => {
    clickTrigger();
    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    hostFixture.detectChanges();

    expect(dropdown()).toBeNull();
  });

  it('should move focus down with ArrowDown', () => {
    clickTrigger();
    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    hostFixture.detectChanges();

    const focused = overlayEl.querySelector('.input-select__option--focused');
    expect(focused).toBeTruthy();
  });

  it('should select the focused option on Enter when open', () => {
    clickTrigger();
    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    hostFixture.detectChanges();
    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    hostFixture.detectChanges();

    expect(host().lastChange()).toBeTruthy();
    expect(dropdown()).toBeNull();
  });

  it('should skip disabled options during ArrowDown navigation', () => {
    host().options.set([
      { id: 'a', title: 'Ativa' },
      { id: 'b', title: 'Desabilitada', disabled: true },
      { id: 'c', title: 'Outra' },
    ]);
    hostFixture.detectChanges();
    clickTrigger();

    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    hostEl().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    hostFixture.detectChanges();

    const focused = overlayEl.querySelector<HTMLElement>('.input-select__option--focused');
    expect(focused?.textContent).toContain('Outra');
  });
});
