import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';

describe('WelcomeComponent', () => {
  let component: WelcomeComponent;
  let fixture: ComponentFixture<WelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose the AquaTrack title', () => {
    expect(component.title).toBe('AquaTrack');
  });

  it('should render the welcome message', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.welcome__title')?.textContent?.trim()).toBe('AquaTrack');
    expect(element.querySelector('.welcome__eyebrow')?.textContent?.trim()).toBe('Bem-vindo');
  });
});
