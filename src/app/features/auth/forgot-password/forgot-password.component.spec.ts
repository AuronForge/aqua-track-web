import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';

describe('ForgotPasswordComponent', () => {
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.auth-page__title')?.textContent?.trim()).toBe(
      'Esqueci Minha Senha',
    );
  });
});
