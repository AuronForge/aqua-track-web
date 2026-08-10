import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { FilterBarComponent } from './filter-bar.component';

@Component({
  standalone: true,
  imports: [FilterBarComponent, ReactiveFormsModule],
  template: `
    <form
      aqFilterBar
      [formGroup]="form"
      caption="3 itens exibidos"
      columns="2fr 1fr"
      [clearDisabled]="clearDisabled"
      (clearFilters)="clear()"
    >
      <label>
        Nome
        <input formControlName="name" />
      </label>
      <label>
        Status
        <input formControlName="status" />
      </label>
    </form>
  `,
})
class TestHostComponent {
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    status: new FormControl('', { nonNullable: true }),
  });
  clearDisabled = false;
  clear = jest.fn();
}

describe('FilterBarComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  function createHostFixture(clearDisabled = false): void {
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    host.clearDisabled = clearDisabled;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    createHostFixture();
  });

  it('should render projected filters and caption', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Nome');
    expect(element.textContent).toContain('Status');
    expect(element.textContent).toContain('3 itens exibidos');
    expect(element.querySelector('.filter-bar__fields')).not.toBeNull();
  });

  it('should expose configured columns through the host style', () => {
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;

    expect(form.style.getPropertyValue('--aq-filter-bar-columns')).toBe('2fr 1fr');
  });

  it('should emit when clearing filters', () => {
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    button.click();

    expect(host.clear).toHaveBeenCalledTimes(1);
  });

  it('should not emit when the clear action is disabled', () => {
    fixture.destroy();
    createHostFixture(true);

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(button.disabled).toBe(true);
    expect(host.clear).not.toHaveBeenCalled();
  });

  it('should guard direct clear calls while disabled', () => {
    fixture.destroy();
    createHostFixture(true);

    const component = fixture.debugElement.query(By.directive(FilterBarComponent))
      .componentInstance as FilterBarComponent & { onClearFilters: () => void };

    component.onClearFilters();

    expect(host.clear).not.toHaveBeenCalled();
  });
});
