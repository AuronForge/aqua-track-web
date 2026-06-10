import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { DropdownMenuItem } from './dropdown-menu-item.model';
import { DropdownMenuPlacement } from './dropdown-menu-placement.type';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuComponent {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly items = input.required<DropdownMenuItem[]>();
  readonly placement = input<DropdownMenuPlacement>('bottom-right');
  readonly showChevron = input<boolean>(true);

  readonly itemClick = output<DropdownMenuItem>();

  readonly isOpen = signal(false);

  readonly panelClass = computed(
    () => `dropdown-menu__panel dropdown-menu__panel--${this.placement()}`,
  );

  readonly isTopPlacement = computed(() => this.placement().startsWith('top'));

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  toggle(event: Event): void {
    event.stopPropagation();
    this.isOpen.update((open) => !open);
  }

  onItemClick(item: DropdownMenuItem, event: Event): void {
    if (item.disabled) return;
    event.stopPropagation();
    this.itemClick.emit(item);
    this.isOpen.set(false);
  }
}
