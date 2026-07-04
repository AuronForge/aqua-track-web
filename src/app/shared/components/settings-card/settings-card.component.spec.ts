import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsCardTone } from './settings-card-tone.type';
import { SettingsCardComponent } from './settings-card.component';

@Component({
  standalone: true,
  imports: [SettingsCardComponent],
  template: `
    <aq-settings-card [icon]="icon()" [title]="title()" [subtitle]="subtitle()" [tone]="tone()">
      <p class="body-content">Body content</p>
      <button slot="actions" type="button">Save</button>
    </aq-settings-card>
  `,
})
class TestHostComponent {
  readonly icon = signal('person');
  readonly title = signal('Profile Information');
  readonly subtitle = signal('Update your personal details');
  readonly tone = signal<SettingsCardTone>('default');
}

describe('SettingsCardComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  function getCard(): HTMLElement {
    return element.querySelector('aq-settings-card') as HTMLElement;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  it('should create', () => {
    expect(getCard()).toBeTruthy();
  });

  it('should render the title and subtitle', () => {
    expect(getCard().textContent).toContain('Profile Information');
    expect(getCard().textContent).toContain('Update your personal details');
  });

  it('should render the icon when provided', () => {
    expect(getCard().querySelector('.settings-card__icon')?.textContent?.trim()).toBe('person');
  });

  it('should not render the icon container when icon is empty', () => {
    hostFixture.componentInstance.icon.set('');
    hostFixture.detectChanges();

    expect(getCard().querySelector('.settings-card__icon-container')).toBeNull();
  });

  it('should apply the default tone class', () => {
    expect(getCard().classList).toContain('settings-card--default');
  });

  it('should apply the danger tone class', () => {
    hostFixture.componentInstance.tone.set('danger');
    hostFixture.detectChanges();

    expect(getCard().classList).toContain('settings-card--danger');
  });

  it('should project body content', () => {
    expect(getCard().querySelector('.body-content')?.textContent).toBe('Body content');
  });

  it('should project actions content', () => {
    expect(getCard().querySelector('[slot=actions]')?.textContent).toBe('Save');
  });
});
