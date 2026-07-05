import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackMessageService } from '../../services/feedback-message.service';
import { FeedbackMessageContainerComponent } from './feedback-message-container.component';

describe('FeedbackMessageContainerComponent', () => {
  let fixture: ComponentFixture<FeedbackMessageContainerComponent>;
  let service: FeedbackMessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackMessageContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackMessageContainerComponent);
    service = TestBed.inject(FeedbackMessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should not render feedback message when there is no active message', () => {
    expect(fixture.nativeElement.querySelector('aq-feedback-message')).toBeNull();
  });

  it('should render feedback message when service has an active message', () => {
    service.showSuccess('Medição salva com sucesso.', { hasIcon: true });
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('aq-feedback-message');
    expect(message).not.toBeNull();
    expect(message.classList).toContain('feedback-message--success');
  });

  it('should render stacked feedback messages when service has multiple active messages', () => {
    service.showSuccess('Primeira mensagem.');
    service.showWarning('Segunda mensagem.');
    fixture.detectChanges();

    const messages = fixture.nativeElement.querySelectorAll('aq-feedback-message');
    expect(messages.length).toBe(2);
    expect(messages[0].classList).toContain('feedback-message--success');
    expect(messages[1].classList).toContain('feedback-message--warning');
  });

  it('should remove feedback messages after clear', () => {
    service.showError('Não foi possível carregar os dados do aquário.');
    fixture.detectChanges();

    service.clear();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('aq-feedback-message')).toBeNull();
  });
});
