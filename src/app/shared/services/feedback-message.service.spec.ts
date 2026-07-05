import { TestBed } from '@angular/core/testing';

import { FeedbackMessageService } from './feedback-message.service';

describe('FeedbackMessageService', () => {
  let service: FeedbackMessageService;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackMessageService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose empty state by default', () => {
    expect(service.message()).toBeNull();
    expect(service.messages()).toEqual([]);
  });

  it('should apply default values when showing a generic message', () => {
    service.show({ label: 'Selecione um aquário para visualizar os dados.' });

    expect(service.message()).toEqual({
      id: 1,
      label: 'Selecione um aquário para visualizar os dados.',
      horizontalPosition: 'top',
      verticalPosition: 'center',
      type: 'information',
      displayDurationMs: 5000,
      hasIcon: false,
      iconName: '',
      iconPosition: 'start',
    });
  });

  it('should show a success message with convenience API', () => {
    service.showSuccess('Medição salva com sucesso.', {
      hasIcon: true,
      verticalPosition: 'end',
    });

    expect(service.message()).toEqual({
      id: 1,
      label: 'Medição salva com sucesso.',
      horizontalPosition: 'top',
      verticalPosition: 'end',
      type: 'success',
      displayDurationMs: 5000,
      hasIcon: true,
      iconName: '',
      iconPosition: 'start',
    });
  });

  it('should show an error message with convenience API', () => {
    service.showError('Não foi possível salvar a medição.');

    expect(service.message()?.type).toBe('error');
    expect(service.message()?.label).toBe('Não foi possível salvar a medição.');
  });

  it('should show a warning message with convenience API', () => {
    service.showWarning('O valor informado está fora da faixa esperada.');

    expect(service.message()?.type).toBe('warning');
  });

  it('should show an information message with convenience API', () => {
    service.showInformation('Nenhuma medição encontrada para este período.');

    expect(service.message()?.type).toBe('information');
  });

  it('should clear all active messages', () => {
    service.showSuccess('Medição salva com sucesso.');
    service.showWarning('Verifique os dados antes de continuar.');

    service.clear();

    expect(service.message()).toBeNull();
    expect(service.messages()).toEqual([]);
  });

  it('should clear a message automatically after the default duration', () => {
    service.showSuccess('Medição salva com sucesso.');

    jest.advanceTimersByTime(4999);
    expect(service.message()).not.toBeNull();

    jest.advanceTimersByTime(1);
    expect(service.message()).toBeNull();
  });

  it('should use the informed display duration', () => {
    service.showWarning('Verifique os dados antes de continuar.', {
      displayDurationMs: 1000,
    });

    jest.advanceTimersByTime(999);
    expect(service.message()).not.toBeNull();

    jest.advanceTimersByTime(1);
    expect(service.message()).toBeNull();
  });

  it('should keep stacked messages active until each timer expires', () => {
    service.showInformation('Primeira mensagem.', { displayDurationMs: 1000 });
    jest.advanceTimersByTime(800);

    service.showError('Segunda mensagem.', { displayDurationMs: 2000 });

    jest.advanceTimersByTime(300);
    expect(service.messages()).toHaveLength(1);
    expect(service.messages()[0]?.label).toBe('Segunda mensagem.');

    jest.advanceTimersByTime(700);
    expect(service.messages()).toHaveLength(1);
    expect(service.message()?.label).toBe('Segunda mensagem.');

    jest.advanceTimersByTime(999);
    expect(service.message()?.label).toBe('Segunda mensagem.');

    jest.advanceTimersByTime(1);
    expect(service.message()).toBeNull();
  });

  it('should stack multiple messages until each one expires', () => {
    service.showSuccess('Primeira mensagem.', { displayDurationMs: 1000 });
    service.showWarning('Segunda mensagem.', { displayDurationMs: 2000 });
    service.showError('Terceira mensagem.', { displayDurationMs: 3000 });

    expect(service.messages()).toHaveLength(3);

    jest.advanceTimersByTime(1000);
    expect(service.messages().map((message) => message.label)).toEqual([
      'Segunda mensagem.',
      'Terceira mensagem.',
    ]);

    jest.advanceTimersByTime(1000);
    expect(service.messages().map((message) => message.label)).toEqual(['Terceira mensagem.']);

    jest.advanceTimersByTime(1000);
    expect(service.messages()).toEqual([]);
  });

  it('should keep persistent messages active when duration is zero until dismissed manually', () => {
    service.showInformation('Mensagem persistente.', { displayDurationMs: 0 });

    jest.advanceTimersByTime(10000);
    expect(service.messages()).toHaveLength(1);

    const persistentMessageId = service.messages()[0]!.id;
    service.dismiss(persistentMessageId);

    expect(service.messages()).toEqual([]);
  });
});
