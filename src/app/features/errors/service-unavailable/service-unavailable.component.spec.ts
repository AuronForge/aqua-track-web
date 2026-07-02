import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServiceUnavailableComponent } from './service-unavailable.component';

describe('ServiceUnavailableComponent', () => {
  let fixture: ComponentFixture<ServiceUnavailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceUnavailableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ServiceUnavailableComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the error title', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('.error-page__title')?.textContent?.trim()).toBe(
      'Sistema indisponivel',
    );
  });
});
