import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ModalRef } from '../../../../shared/modal/modal-ref';
import { AquariumWaterParameter } from '../../models/aquarium-detail.model';
import { AddMeasurementModalComponent } from './add-measurement-modal.component';

const parameters: AquariumWaterParameter[] = [
  {
    id: 'wp-1',
    key: 'ph',
    name: 'pH',
    category: 'CHEMICAL',
    defaultUnit: '',
  },
  {
    id: 'wp-2',
    key: 'nitrate',
    name: 'Nitrato',
    category: 'CHEMICAL',
    defaultUnit: 'mg/L',
  },
];

describe('AddMeasurementModalComponent', () => {
  async function createFixture(submitMeasurement = jest.fn(() => of(void 0))): Promise<{
    fixture: ComponentFixture<AddMeasurementModalComponent>;
    modalRef: { close: jest.Mock };
    submitMeasurement: jest.Mock;
  }> {
    const modalRef = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [AddMeasurementModalComponent],
      providers: [{ provide: ModalRef, useValue: modalRef }],
    }).compileComponents();

    const fixture = TestBed.createComponent(AddMeasurementModalComponent);
    fixture.componentRef.setInput('parameters', parameters);
    fixture.componentRef.setInput('submitMeasurement', submitMeasurement);
    fixture.detectChanges();

    return { fixture, modalRef, submitMeasurement };
  }

  afterEach(() => TestBed.resetTestingModule());

  it('renders the modal title and parameter select', async () => {
    const { fixture } = await createFixture();
    const component = fixture.componentInstance as AddMeasurementModalComponent & {
      parameterOptions: () => { id: string; title: string }[];
    };

    expect(fixture.nativeElement.textContent).toContain('Adicionar Medição');
    expect(component.parameterOptions()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'ph', title: 'pH' }),
        expect.objectContaining({ id: 'nitrate', title: 'Nitrato' }),
      ]),
    );
  });

  it('does not submit invalid forms', async () => {
    const { fixture, submitMeasurement } = await createFixture();
    const component = fixture.componentInstance as AddMeasurementModalComponent & {
      save: () => void;
      form: AddMeasurementModalComponent['form'];
    };

    component.form.controls.value.setValue('abc');
    component.save();

    expect(submitMeasurement).not.toHaveBeenCalled();
  });

  it('submits normalized form values and closes after success', async () => {
    const { fixture, modalRef, submitMeasurement } = await createFixture();
    const component = fixture.componentInstance as AddMeasurementModalComponent & {
      save: () => void;
      form: AddMeasurementModalComponent['form'];
    };

    component.form.setValue({
      parameterKey: 'nitrate',
      value: '16,5',
      date: '2026-08-06',
      time: '18:57',
      notes: ' API test ',
    });
    component.save();

    expect(submitMeasurement).toHaveBeenCalledWith({
      parameterKey: 'nitrate',
      value: 16.5,
      date: '2026-08-06',
      time: '18:57',
      notes: 'API test',
    });
    expect(modalRef.close).toHaveBeenCalledWith({ reason: 'action', actionId: 'save' });
  });

  it('keeps the modal open and shows an error when submission fails', async () => {
    const { fixture, modalRef } = await createFixture(
      jest.fn(() => throwError(() => new Error('boom'))),
    );
    const component = fixture.componentInstance as AddMeasurementModalComponent & {
      save: () => void;
      submitError: () => boolean;
      saving: () => boolean;
      form: AddMeasurementModalComponent['form'];
    };

    component.form.setValue({
      parameterKey: 'ph',
      value: '7.2',
      date: '2026-08-06',
      time: '18:57',
      notes: '',
    });
    component.save();
    fixture.detectChanges();

    expect(component.saving()).toBe(false);
    expect(component.submitError()).toBe(true);
    expect(modalRef.close).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Não foi possível salvar');
  });

  it('closes with cancel result', async () => {
    const { fixture, modalRef } = await createFixture();
    const component = fixture.componentInstance as AddMeasurementModalComponent & {
      cancel: () => void;
    };

    component.cancel();

    expect(modalRef.close).toHaveBeenCalledWith({ reason: 'action', actionId: 'cancel' });
  });
});
