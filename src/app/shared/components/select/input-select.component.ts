import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { InputSelectChangeEvent } from './input-select-change-event.model';
import { InputSelectOption } from './input-select-option.model';
import { InputSelectSize } from './input-select-size.type';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-input-select',
  standalone: true,
  templateUrl: './input-select.component.html',
  styleUrl: './input-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '(keydown)': 'onKeydown($event)',
  },
})
export class InputSelectComponent implements OnDestroy {
  readonly options = input<InputSelectOption[]>([]);
  readonly selectedOption = input<InputSelectOption | null>(null);
  readonly placeholder = input<string>('Selecione uma opção');
  readonly size = input<InputSelectSize>('medium');
  readonly disabled = input<boolean>(false);
  readonly loading = input<boolean>(false);

  readonly selectionChange = output<InputSelectChangeEvent>();

  private readonly triggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly dropdownTemplate = viewChild.required<TemplateRef<unknown>>('dropdownTemplate');

  private readonly overlay = inject(Overlay);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly elementRef = inject(ElementRef);

  protected readonly isOpen = signal(false);
  protected readonly focusedIndex = signal(-1);
  protected readonly listboxId = `input-select-listbox-${Math.random().toString(36).slice(2, 9)}`;

  protected readonly hostClass = computed(() => {
    const parts = ['input-select', `input-select--${this.size()}`];
    if (this.isOpen()) parts.push('input-select--open');
    if (this.disabled()) parts.push('input-select--disabled');
    return parts.join(' ');
  });

  private overlayRef: OverlayRef | null = null;

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }

  protected toggleDropdown(): void {
    if (this.disabled() || this.loading()) return;
    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  protected selectOption(option: InputSelectOption): void {
    if (option.disabled) return;
    this.selectionChange.emit({ option, previousOption: this.selectedOption() });
    this.closeDropdown();
  }

  protected isSelected(option: InputSelectOption): boolean {
    return this.selectedOption()?.id === option.id;
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isOpen()) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.openDropdown();
      }
      return;
    }

    const options = this.options();

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.shiftFocus(1, options);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.shiftFocus(-1, options);
        break;
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const idx = this.focusedIndex();
        if (idx >= 0 && idx < options.length) {
          this.selectOption(options[idx]);
        }
        break;
      }
    }
  }

  private openDropdown(): void {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
      ])
      .withPush(true)
      .withViewportMargin(16);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      width: this.elementRef.nativeElement.offsetWidth,
      minWidth: 200,
    });

    const portal = new TemplatePortal(this.dropdownTemplate(), this.viewContainerRef);
    this.overlayRef.attach(portal);
    this.isOpen.set(true);

    const selectedId = this.selectedOption()?.id;
    const initialIndex = selectedId ? this.options().findIndex((o) => o.id === selectedId) : -1;
    this.focusedIndex.set(initialIndex);

    this.overlayRef.backdropClick().subscribe(() => this.closeDropdown());
    this.overlayRef.detachments().subscribe(() => this.isOpen.set(false));
  }

  private closeDropdown(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
    this.focusedIndex.set(-1);
    this.triggerRef().nativeElement.focus();
  }

  private shiftFocus(direction: 1 | -1, options: InputSelectOption[]): void {
    const enabled = options.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i !== -1);
    if (enabled.length === 0) return;

    const cur = this.focusedIndex();
    const pos = enabled.indexOf(cur);
    const next =
      pos === -1
        ? direction === 1
          ? 0
          : enabled.length - 1
        : (pos + direction + enabled.length) % enabled.length;
    this.focusedIndex.set(enabled[next]);
  }
}
