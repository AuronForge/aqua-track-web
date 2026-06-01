import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';

describe('RegistrationComponent', () => {
  let fixture: ComponentFixture<RegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistrationComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.auth-page__title')?.textContent?.trim()).toBe(
      'Registrar Usuario',
    );
  });
});
