import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuItem } from './dropdown-menu-item.model';
import { DropdownMenuPlacement } from './dropdown-menu-placement.type';
import { DropdownMenuComponent } from './dropdown-menu.component';

const STUB_ITEMS: DropdownMenuItem[] = [
  { id: 'item-1', label: 'Item 1', icon: '<svg></svg>' },
  { id: 'item-2', label: 'Item 2' },
  { id: 'item-3', label: 'Delete', isDestructive: true, hasDividerBefore: true },
  { id: 'item-4', label: 'Disabled', disabled: true },
];

@Component({
  standalone: true,
  imports: [DropdownMenuComponent],
  template: `
    <app-dropdown-menu
      [items]="items()"
      [placement]="placement()"
      [showChevron]="showChevron()"
      (itemClick)="onItemClick($event)"
    >
      <ng-container slot="trigger">
        <span class="test-trigger-content">Open</span>
      </ng-container>
      <div slot="header" class="test-header">Header</div>
    </app-dropdown-menu>
  `,
})
class TestHostComponent {
  readonly items = signal<DropdownMenuItem[]>(STUB_ITEMS);
  readonly placement = signal<DropdownMenuPlacement>('bottom-right');
  readonly showChevron = signal<boolean>(true);

  lastClicked: DropdownMenuItem | null = null;

  onItemClick(item: DropdownMenuItem): void {
    this.lastClicked = item;
  }
}

describe('DropdownMenuComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getComponent(): DropdownMenuComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getTrigger(): HTMLButtonElement {
    return element.querySelector('.dropdown-menu__trigger') as HTMLButtonElement;
  }

  function getPanel(): HTMLElement | null {
    return element.querySelector('.dropdown-menu__panel');
  }

  function getItems(): NodeListOf<HTMLButtonElement> {
    return element.querySelectorAll('.dropdown-menu__item');
  }

  function openPanel(): void {
    getTrigger().click();
    hostFixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  // ── Creation ──────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(getComponent()).toBeTruthy();
  });

  // ── Initial state ─────────────────────────────────────────────────────────

  it('should have panel closed on initial render', () => {
    expect(getComponent().isOpen()).toBe(false);
    expect(getPanel()).toBeNull();
  });

  it('should have aria-expanded set to false on initial render', () => {
    expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
  });

  // ── Toggle ────────────────────────────────────────────────────────────────

  it('should open panel when trigger is clicked', () => {
    openPanel();

    expect(getComponent().isOpen()).toBe(true);
    expect(getPanel()).toBeTruthy();
  });

  it('should close panel when trigger is clicked again', () => {
    openPanel();
    getTrigger().click();
    hostFixture.detectChanges();

    expect(getComponent().isOpen()).toBe(false);
    expect(getPanel()).toBeNull();
  });

  it('should add --open modifier to root when panel is open', () => {
    openPanel();

    expect(element.querySelector('.dropdown-menu--open')).toBeTruthy();
  });

  it('should remove --open modifier from root when panel is closed', () => {
    openPanel();
    getTrigger().click();
    hostFixture.detectChanges();

    expect(element.querySelector('.dropdown-menu--open')).toBeNull();
  });

  // ── Aria ──────────────────────────────────────────────────────────────────

  it('should set aria-expanded to true when panel is open', () => {
    openPanel();

    expect(getTrigger().getAttribute('aria-expanded')).toBe('true');
  });

  it('should set aria-expanded to false when panel is closed', () => {
    openPanel();
    getTrigger().click();
    hostFixture.detectChanges();

    expect(getTrigger().getAttribute('aria-expanded')).toBe('false');
  });

  // ── Outside / inside click ────────────────────────────────────────────────

  it('should close panel when clicking outside the component', () => {
    openPanel();

    getComponent().onDocumentClick(new MouseEvent('click'));
    hostFixture.detectChanges();

    expect(getPanel()).toBeNull();
  });

  it('should not close panel when clicking inside the component', () => {
    openPanel();

    const insideClick = new MouseEvent('click');
    Object.defineProperty(insideClick, 'target', { value: getTrigger() });
    getComponent().onDocumentClick(insideClick);
    hostFixture.detectChanges();

    expect(getPanel()).toBeTruthy();
  });

  // ── Escape key ────────────────────────────────────────────────────────────

  it('should close panel when Escape is pressed', () => {
    openPanel();

    getComponent().onEscape();
    hostFixture.detectChanges();

    expect(getPanel()).toBeNull();
  });

  it('should do nothing on Escape when panel is already closed', () => {
    getComponent().onEscape();
    hostFixture.detectChanges();

    expect(getComponent().isOpen()).toBe(false);
  });

  // ── Item click ────────────────────────────────────────────────────────────

  it('should emit itemClick with the clicked item', () => {
    openPanel();

    getItems()[0].click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.lastClicked).toEqual(STUB_ITEMS[0]);
  });

  it('should close panel after an item is clicked', () => {
    openPanel();

    getItems()[0].click();
    hostFixture.detectChanges();

    expect(getPanel()).toBeNull();
  });

  it('should not emit itemClick when a disabled item is clicked', () => {
    openPanel();

    const disabledItem = getItems()[3]; // item-4 is disabled
    disabledItem.click();
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.lastClicked).toBeNull();
  });

  it('should return early without emitting when onItemClick is called with a disabled item', () => {
    const event = new MouseEvent('click');
    const stopPropagationSpy = jest.spyOn(event, 'stopPropagation');

    getComponent().onItemClick(STUB_ITEMS[3], event); // STUB_ITEMS[3] is disabled

    expect(stopPropagationSpy).not.toHaveBeenCalled();
    expect(hostFixture.componentInstance.lastClicked).toBeNull();
  });

  // ── stopPropagation ───────────────────────────────────────────────────────

  it('should stop propagation when the trigger is clicked', () => {
    const event = new MouseEvent('click');
    const spy = jest.spyOn(event, 'stopPropagation');

    getComponent().toggle(event);

    expect(spy).toHaveBeenCalled();
  });

  it('should stop propagation when a non-disabled item is clicked', () => {
    const event = new MouseEvent('click');
    const spy = jest.spyOn(event, 'stopPropagation');

    getComponent().onItemClick(STUB_ITEMS[0], event);

    expect(spy).toHaveBeenCalled();
  });

  // ── Items rendering ───────────────────────────────────────────────────────

  it('should render all items when the panel is open', () => {
    openPanel();

    expect(getItems().length).toBe(STUB_ITEMS.length);
  });

  it('should render item label', () => {
    openPanel();

    const labels = element.querySelectorAll('.dropdown-menu__item-label');
    expect(labels[0].textContent?.trim()).toBe('Item 1');
  });

  it('should render icon for items that have one', () => {
    openPanel();

    const iconSpans = element.querySelectorAll('.dropdown-menu__item-icon');
    expect(iconSpans.length).toBe(1); // only item-1 has an icon
  });

  it('should apply --destructive class to destructive items', () => {
    openPanel();

    const items = getItems();
    expect(items[2].classList).toContain('dropdown-menu__item--destructive');
    expect(items[0].classList).not.toContain('dropdown-menu__item--destructive');
  });

  it('should apply --disabled class to disabled items', () => {
    openPanel();

    const items = getItems();
    expect(items[3].classList).toContain('dropdown-menu__item--disabled');
    expect(items[0].classList).not.toContain('dropdown-menu__item--disabled');
  });

  it('should render divider before items with hasDividerBefore', () => {
    openPanel();

    const dividers = element.querySelectorAll('.dropdown-menu__divider');
    expect(dividers.length).toBe(1); // only item-3 has hasDividerBefore
  });

  // ── Placement ─────────────────────────────────────────────────────────────

  it('should apply bottom-right placement class to panel by default', () => {
    openPanel();

    expect(getPanel()?.classList).toContain('dropdown-menu__panel--bottom-right');
  });

  it('should apply the correct placement class when placement changes', () => {
    hostFixture.componentInstance.placement.set('top-left');
    hostFixture.detectChanges();
    openPanel();

    expect(getPanel()?.classList).toContain('dropdown-menu__panel--top-left');
  });

  it('should add --top modifier to root for top placements', () => {
    hostFixture.componentInstance.placement.set('top-right');
    hostFixture.detectChanges();

    expect(element.querySelector('.dropdown-menu--top')).toBeTruthy();
  });

  it('should not add --top modifier to root for bottom placements', () => {
    hostFixture.componentInstance.placement.set('bottom-left');
    hostFixture.detectChanges();

    expect(element.querySelector('.dropdown-menu--top')).toBeNull();
  });

  // ── Chevron ───────────────────────────────────────────────────────────────

  it('should render chevron when showChevron is true', () => {
    expect(element.querySelector('.dropdown-menu__chevron')).toBeTruthy();
  });

  it('should not render chevron when showChevron is false', () => {
    hostFixture.componentInstance.showChevron.set(false);
    hostFixture.detectChanges();

    expect(element.querySelector('.dropdown-menu__chevron')).toBeNull();
  });

  // ── Content projection ────────────────────────────────────────────────────

  it('should project trigger slot content inside the trigger button', () => {
    expect(getTrigger().querySelector('.test-trigger-content')).toBeTruthy();
  });

  it('should project header slot content inside the panel', () => {
    openPanel();

    expect(getPanel()?.querySelector('.test-header')).toBeTruthy();
  });
});
