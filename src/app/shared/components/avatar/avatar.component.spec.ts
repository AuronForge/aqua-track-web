import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarColor } from './avatar-color.type';
import { AvatarSize } from './avatar-size.type';
import { AvatarVariant } from './avatar-variant.type';
import { AvatarComponent } from './avatar.component';

const STUB_ICON = 'person';
const STUB_SRC = 'https://example.com/avatar.jpg';

@Component({
  standalone: true,
  imports: [AvatarComponent],
  template: `
    <app-avatar
      [variant]="variant()"
      [color]="color()"
      [size]="size()"
      [initials]="initials()"
      [src]="src()"
      [alt]="alt()"
      [icon]="icon()"
    />
  `,
})
class TestHostComponent {
  readonly variant = signal<AvatarVariant>('initials');
  readonly color = signal<AvatarColor>('primary');
  readonly size = signal<AvatarSize>('normal');
  readonly initials = signal<string>('JD');
  readonly src = signal<string>('');
  readonly alt = signal<string>('');
  readonly icon = signal<string>('');
}

describe('AvatarComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getComponent(): AvatarComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getAvatar(): HTMLElement {
    return element.querySelector('.avatar') as HTMLElement;
  }

  function getInitialsEl(): HTMLElement | null {
    return element.querySelector('.avatar__initials');
  }

  function getImageEl(): HTMLImageElement | null {
    return element.querySelector('.avatar__image');
  }

  function getIconEl(): HTMLElement | null {
    return element.querySelector('.avatar__icon');
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

  // ── Default state ─────────────────────────────────────────────────────────

  it('should render the initials variant by default', () => {
    expect(getInitialsEl()).toBeTruthy();
  });

  it('should apply primary color by default', () => {
    expect(getAvatar().classList).toContain('avatar--primary');
  });

  it('should apply normal size by default', () => {
    expect(getAvatar().classList).toContain('avatar--normal');
  });

  // ── Variants ──────────────────────────────────────────────────────────────

  it('should render only the initials element when variant is initials', () => {
    hostFixture.componentInstance.variant.set('initials');
    hostFixture.detectChanges();

    expect(getInitialsEl()).toBeTruthy();
    expect(getImageEl()).toBeNull();
    expect(getIconEl()).toBeNull();
  });

  it('should render only the image element when variant is circular', () => {
    hostFixture.componentInstance.variant.set('circular');
    hostFixture.componentInstance.src.set(STUB_SRC);
    hostFixture.detectChanges();

    expect(getImageEl()).toBeTruthy();
    expect(getInitialsEl()).toBeNull();
    expect(getIconEl()).toBeNull();
  });

  it('should render only the icon element when variant is icon', () => {
    hostFixture.componentInstance.variant.set('icon');
    hostFixture.componentInstance.icon.set(STUB_ICON);
    hostFixture.detectChanges();

    expect(getIconEl()).toBeTruthy();
    expect(getInitialsEl()).toBeNull();
    expect(getImageEl()).toBeNull();
  });

  it('should apply the variant modifier class to the avatar', () => {
    hostFixture.componentInstance.variant.set('circular');
    hostFixture.detectChanges();

    expect(getAvatar().classList).toContain('avatar--circular');
  });

  // ── Icon ──────────────────────────────────────────────────────────────────

  it('should render the icon name inside the icon element', () => {
    hostFixture.componentInstance.variant.set('icon');
    hostFixture.componentInstance.icon.set(STUB_ICON);
    hostFixture.detectChanges();

    expect(getIconEl()?.textContent?.trim()).toBe(STUB_ICON);
  });

  // ── Initials ──────────────────────────────────────────────────────────────

  it('should display the provided initials', () => {
    hostFixture.componentInstance.initials.set('AB');
    hostFixture.detectChanges();

    expect(getInitialsEl()?.textContent?.trim()).toBe('AB');
  });

  it('should truncate initials to 3 characters', () => {
    hostFixture.componentInstance.initials.set('JOHN');
    hostFixture.detectChanges();

    expect(getInitialsEl()?.textContent?.trim()).toBe('JOH');
  });

  it('should uppercase initials', () => {
    hostFixture.componentInstance.initials.set('jd');
    hostFixture.detectChanges();

    expect(getInitialsEl()?.textContent?.trim()).toBe('JD');
  });

  // ── Circular ──────────────────────────────────────────────────────────────

  it('should set src on the image element', () => {
    hostFixture.componentInstance.variant.set('circular');
    hostFixture.componentInstance.src.set(STUB_SRC);
    hostFixture.detectChanges();

    expect(getImageEl()?.getAttribute('src')).toBe(STUB_SRC);
  });

  it('should set alt on the image element', () => {
    hostFixture.componentInstance.variant.set('circular');
    hostFixture.componentInstance.alt.set('User photo');
    hostFixture.detectChanges();

    expect(getImageEl()?.getAttribute('alt')).toBe('User photo');
  });

  // ── Colors ────────────────────────────────────────────────────────────────

  it('should apply primary color modifier', () => {
    hostFixture.componentInstance.color.set('primary');
    hostFixture.detectChanges();

    expect(getAvatar().classList).toContain('avatar--primary');
  });

  it('should apply secondary color modifier', () => {
    hostFixture.componentInstance.color.set('secondary');
    hostFixture.detectChanges();

    expect(getAvatar().classList).toContain('avatar--secondary');
  });

  it('should apply tertiary color modifier', () => {
    hostFixture.componentInstance.color.set('tertiary');
    hostFixture.detectChanges();

    expect(getAvatar().classList).toContain('avatar--tertiary');
  });

  // ── Sizes ─────────────────────────────────────────────────────────────────

  it('should apply small size modifier', () => {
    hostFixture.componentInstance.size.set('small');
    hostFixture.detectChanges();

    expect(getAvatar().classList).toContain('avatar--small');
  });

  it('should apply normal size modifier', () => {
    expect(getAvatar().classList).toContain('avatar--normal');
  });

  it('should apply large size modifier', () => {
    hostFixture.componentInstance.size.set('large');
    hostFixture.detectChanges();

    expect(getAvatar().classList).toContain('avatar--large');
  });

  // ── Accessibility ─────────────────────────────────────────────────────────

  it('should have role="img" on the avatar element', () => {
    expect(getAvatar().getAttribute('role')).toBe('img');
  });

  it('should use alt as aria-label when provided', () => {
    hostFixture.componentInstance.variant.set('circular');
    hostFixture.componentInstance.alt.set('User photo');
    hostFixture.detectChanges();

    expect(getAvatar().getAttribute('aria-label')).toBe('User photo');
  });

  it('should fall back to truncated initials for aria-label when alt is not set', () => {
    hostFixture.componentInstance.initials.set('JD');
    hostFixture.detectChanges();

    expect(getAvatar().getAttribute('aria-label')).toBe('JD');
  });

  it('should fall back to "avatar" for aria-label when neither alt nor initials are set', () => {
    hostFixture.componentInstance.initials.set('');
    hostFixture.detectChanges();

    expect(getAvatar().getAttribute('aria-label')).toBe('avatar');
  });
});
