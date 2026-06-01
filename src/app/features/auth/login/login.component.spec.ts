import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the page title', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.auth-page__title')?.textContent?.trim()).toBe('Login');
  });
});
