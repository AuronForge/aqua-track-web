import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoUploadRejection } from './photo-upload-rejection.model';
import { PhotoUploadComponent } from './photo-upload.component';

@Component({
  standalone: true,
  imports: [PhotoUploadComponent],
  template: `
    <aq-photo-upload
      [accept]="accept()"
      [maxFileSizeBytes]="maxFileSizeBytes()"
      [fieldName]="fieldName()"
      [showPreview]="showPreview()"
      [previewUrl]="previewUrl()"
      [hint]="hint()"
      [errorMessage]="errorMessage()"
      [disabled]="disabled()"
      [invalidTypeMessage]="invalidTypeMessage()"
      [maxSizeMessage]="maxSizeMessage()"
      (fileSelected)="selectedFile.set($event)"
      (formDataSelected)="selectedFormData.set($event)"
      (fileRejected)="rejection.set($event)"
    />
  `,
})
class TestHostComponent {
  readonly accept = signal('image/jpeg,image/png,image/webp');
  readonly maxFileSizeBytes = signal(5 * 1024 * 1024);
  readonly fieldName = signal('photo');
  readonly showPreview = signal(false);
  readonly previewUrl = signal<string | null>(null);
  readonly hint = signal<string | undefined>(undefined);
  readonly errorMessage = signal<string | null>(null);
  readonly disabled = signal(false);
  readonly invalidTypeMessage = signal<string | undefined>(undefined);
  readonly maxSizeMessage = signal<string | undefined>(undefined);

  readonly selectedFile = signal<File | null>(null);
  readonly selectedFormData = signal<FormData | null>(null);
  readonly rejection = signal<PhotoUploadRejection | null>(null);
}

describe('PhotoUploadComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  function getFileInput(): HTMLInputElement {
    return element.querySelector('input[type="file"]') as HTMLInputElement;
  }

  function getSurface(): HTMLDivElement {
    return element.querySelector('.photo-upload') as HTMLDivElement;
  }

  function getComponent(): PhotoUploadComponent {
    return fixture.debugElement.children[0].componentInstance as PhotoUploadComponent;
  }

  function setSelectedFiles(input: HTMLInputElement, files: File[]): void {
    Object.defineProperty(input, 'files', {
      value: files,
      configurable: true,
    });
  }

  it('should render the default guidance copy', () => {
    expect(element.textContent).toContain('Drop your image here, or');
    expect(element.textContent).toContain('browse');
    expect(element.textContent).toContain('Supports: JPG, PNG, WebP (Max 5MB)');
  });

  it('should trigger the hidden input when the surface is clicked', () => {
    const input = getFileInput();
    const clickSpy = jest.spyOn(input, 'click');

    getSurface().click();

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should emit the selected file and a FormData payload for a valid image', () => {
    const input = getFileInput();
    const file = new File(['image-bytes'], 'cover.png', { type: 'image/png' });
    setSelectedFiles(input, [file]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBe(file);
    expect(fixture.componentInstance.selectedFormData()).toBeInstanceOf(FormData);
    expect(fixture.componentInstance.selectedFormData()?.get('photo')).toBe(file);
    expect(fixture.componentInstance.rejection()).toBeNull();
  });

  it('should reject files with an unsupported type', () => {
    const input = getFileInput();
    const file = new File(['pdf-bytes'], 'manual.pdf', { type: 'application/pdf' });
    setSelectedFiles(input, [file]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBeNull();
    expect(fixture.componentInstance.rejection()).toEqual({
      file,
      reason: 'invalid-type',
      message: 'Supported formats: JPG, PNG, WebP.',
    });
    expect(element.querySelector('.photo-upload__error')?.textContent).toContain(
      'Supported formats: JPG, PNG, WebP.',
    );
  });

  it('should reject files larger than the allowed size', () => {
    const input = getFileInput();
    const file = new File(['oversized'], 'cover.webp', { type: 'image/webp' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    setSelectedFiles(input, [file]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBeNull();
    expect(fixture.componentInstance.rejection()?.reason).toBe('file-too-large');
    expect(element.querySelector('.photo-upload__error')?.textContent).toContain('5MB');
  });

  it('should render a preview when enabled and a valid image is selected', () => {
    fixture.componentInstance.showPreview.set(true);
    const originalCreateObjectUrl = URL.createObjectURL;
    URL.createObjectURL = jest.fn().mockReturnValue('blob:preview');
    const input = getFileInput();
    const file = new File(['image-bytes'], 'preview.jpg', { type: 'image/jpeg' });
    setSelectedFiles(input, [file]);

    fixture.detectChanges();
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(
      (element.querySelector('.photo-upload__preview-image') as HTMLImageElement).src,
    ).toContain('blob:preview');

    URL.createObjectURL = originalCreateObjectUrl;
  });

  it('should expose the dragging state while a file is over the surface', () => {
    const surface = getSurface();

    surface.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(surface.classList.contains('photo-upload--dragging')).toBe(true);

    surface.dispatchEvent(new Event('dragleave', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(surface.classList.contains('photo-upload--dragging')).toBe(false);
  });

  it('should not open the input while disabled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const input = getFileInput();
    const clickSpy = jest.spyOn(input, 'click');

    getSurface().click();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('should ignore the file input change when no file is selected', () => {
    const input = getFileInput();
    setSelectedFiles(input, []);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBeNull();
    expect(fixture.componentInstance.selectedFormData()).toBeNull();
    expect(fixture.componentInstance.rejection()).toBeNull();
  });

  it('should open the file picker with Enter and Space, but ignore other keys', () => {
    const input = getFileInput();
    const clickSpy = jest.spyOn(input, 'click');
    const component = getComponent();

    component['onKeydown'](new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(clickSpy).not.toHaveBeenCalled();

    component['onKeydown'](new KeyboardEvent('keydown', { key: 'Enter' }));
    const callsAfterEnter = clickSpy.mock.calls.length;
    expect(callsAfterEnter).toBeGreaterThan(0);

    component['onKeydown'](new KeyboardEvent('keydown', { key: ' ' }));
    const callsAfterSpace = clickSpy.mock.calls.length;

    expect(callsAfterSpace).toBeGreaterThan(callsAfterEnter);
  });

  it('should ignore dragover and drop interactions while disabled', () => {
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    const surface = getSurface();

    surface.dispatchEvent(new Event('dragover', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(surface.classList.contains('photo-upload--dragging')).toBe(false);

    surface.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedFile()).toBeNull();
  });

  it('should ignore a drop event when no file is provided', () => {
    const surface = getSurface();
    const dropEvent = new Event('drop', { bubbles: true, cancelable: true }) as DragEvent;

    Object.defineProperty(dropEvent, 'dataTransfer', { value: { files: [] } });

    surface.dispatchEvent(dropEvent);
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBeNull();
    expect(fixture.componentInstance.rejection()).toBeNull();
  });

  it('should support files matched by extension tokens', () => {
    fixture.componentInstance.accept.set('.png');
    fixture.detectChanges();

    const input = getFileInput();
    const file = new File(['image-bytes'], 'cover.PNG', { type: '' });
    setSelectedFiles(input, [file]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBe(file);
    expect(fixture.componentInstance.selectedFormData()?.get('photo')).toBe(file);
  });

  it('should support files matched by wildcard mime tokens', () => {
    fixture.componentInstance.accept.set('image/*');
    fixture.detectChanges();

    const input = getFileInput();
    const file = new File(['image-bytes'], 'reef.gif', { type: 'image/gif' });
    setSelectedFiles(input, [file]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBe(file);
  });

  it('should accept any file when accept is empty and render the generic hint', () => {
    fixture.componentInstance.accept.set('');
    fixture.detectChanges();

    expect(element.textContent).toContain('Supports: images (Max 5MB)');

    const input = getFileInput();
    const file = new File(['any-bytes'], 'document.pdf', { type: 'application/pdf' });
    setSelectedFiles(input, [file]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedFile()).toBe(file);
  });

  it('should render custom hint and API error message when provided', () => {
    fixture.componentInstance.hint.set('Envie uma foto principal do aquário.');
    fixture.componentInstance.errorMessage.set('Falha ao enviar a imagem.');
    fixture.detectChanges();

    expect(element.textContent).toContain('Envie uma foto principal do aquário.');
    expect(element.textContent).toContain('Falha ao enviar a imagem.');
    expect(getSurface().classList.contains('photo-upload--invalid')).toBe(true);
  });

  it('should use custom validation messages when provided', () => {
    fixture.componentInstance.invalidTypeMessage.set('Tipo de arquivo não permitido.');
    fixture.componentInstance.maxSizeMessage.set('Arquivo acima do limite configurado.');
    fixture.detectChanges();

    const input = getFileInput();
    const invalidFile = new File(['pdf-bytes'], 'manual.pdf', { type: 'application/pdf' });
    setSelectedFiles(input, [invalidFile]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.rejection()?.message).toBe('Tipo de arquivo não permitido.');

    const oversizedFile = new File(['oversized'], 'cover.webp', { type: 'image/webp' });
    Object.defineProperty(oversizedFile, 'size', { value: 6 * 1024 * 1024 });
    setSelectedFiles(input, [oversizedFile]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.componentInstance.rejection()?.message).toBe(
      'Arquivo acima do limite configurado.',
    );
  });

  it('should render an external preview url and apply the preview class', () => {
    fixture.componentInstance.showPreview.set(true);
    fixture.componentInstance.previewUrl.set('https://example.com/photo.png');
    fixture.detectChanges();

    const image = element.querySelector('.photo-upload__preview-image') as HTMLImageElement;

    expect(image.src).toContain('https://example.com/photo.png');
    expect(getSurface().classList.contains('photo-upload--with-preview')).toBe(true);
  });

  it('should skip local preview generation when URL.createObjectURL is unavailable', () => {
    fixture.componentInstance.showPreview.set(true);
    const originalCreateObjectUrl = URL.createObjectURL;
    URL.createObjectURL = undefined as unknown as typeof URL.createObjectURL;
    fixture.detectChanges();

    const input = getFileInput();
    const file = new File(['image-bytes'], 'preview.jpg', { type: 'image/jpeg' });
    setSelectedFiles(input, [file]);

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(element.querySelector('.photo-upload__preview-image')).toBeNull();

    URL.createObjectURL = originalCreateObjectUrl;
  });

  it('should revoke the previous object url when replacing a preview and on destroy', () => {
    fixture.componentInstance.showPreview.set(true);
    const originalCreateObjectUrl = URL.createObjectURL;
    const originalRevokeObjectUrl = URL.revokeObjectURL;
    URL.createObjectURL = jest
      .fn()
      .mockReturnValueOnce('blob:first-preview')
      .mockReturnValueOnce('blob:second-preview');
    URL.revokeObjectURL = jest.fn();
    fixture.detectChanges();

    const input = getFileInput();
    const firstFile = new File(['image-bytes'], 'first.jpg', { type: 'image/jpeg' });
    setSelectedFiles(input, [firstFile]);
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const secondFile = new File(['image-bytes'], 'second.jpg', { type: 'image/jpeg' });
    setSelectedFiles(input, [secondFile]);
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:first-preview');

    fixture.destroy();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:second-preview');

    URL.createObjectURL = originalCreateObjectUrl;
    URL.revokeObjectURL = originalRevokeObjectUrl;
  });
});
