import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { PhotoUploadRejection } from './photo-upload-rejection.model';

const DEFAULT_MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const DEFAULT_ACCEPT = 'image/jpeg,image/png,image/webp';

const MIME_TYPE_LABELS: Record<string, string> = {
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'image/gif': 'GIF',
};

let nextUniqueId = 0;

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-photo-upload',
  standalone: true,
  templateUrl: './photo-upload.component.html',
  styleUrl: './photo-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploadComponent {
  readonly label = input<string>('Drop your image here, or');
  readonly browseLabel = input<string>('browse');
  readonly hint = input<string>();
  readonly accept = input<string>(DEFAULT_ACCEPT);
  readonly maxFileSizeBytes = input<number>(DEFAULT_MAX_FILE_SIZE_BYTES);
  readonly fieldName = input<string>('file');
  readonly icon = input<string>('image');
  readonly previewUrl = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly invalidTypeMessage = input<string>();
  readonly maxSizeMessage = input<string>();
  readonly showPreview = input<boolean>(false);
  // eslint-disable-next-line @angular-eslint/no-input-rename
  readonly disabledState = input(false, { alias: 'disabled' });

  readonly fileSelected = output<File>();
  readonly formDataSelected = output<FormData>();
  readonly fileRejected = output<PhotoUploadRejection>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly generatedId = `aq-photo-upload-${nextUniqueId++}`;
  private objectUrl: string | null = null;

  protected readonly dragging = signal(false);
  protected readonly localError = signal<string | null>(null);
  protected readonly selectedFileName = signal<string | null>(null);
  protected readonly selectedPreviewUrl = signal<string | null>(null);

  protected readonly hintId = computed(() => `${this.generatedId}-hint`);
  protected readonly errorId = computed(() => `${this.generatedId}-error`);
  protected readonly inputId = computed(() => `${this.generatedId}-input`);
  protected readonly isDisabled = computed(() => this.disabledState());
  protected readonly resolvedError = computed(() => this.localError() ?? this.errorMessage());
  protected readonly resolvedHint = computed(
    () =>
      this.hint() ??
      `Supports: ${formatAcceptedTypes(this.accept())} (Max ${formatFileSize(this.maxFileSizeBytes())})`,
  );
  protected readonly resolvedPreviewUrl = computed(
    () => this.selectedPreviewUrl() ?? this.previewUrl(),
  );
  protected readonly describedBy = computed(() => {
    const ids = [this.hintId()];

    if (this.resolvedError()) {
      ids.push(this.errorId());
    }

    return ids.join(' ');
  });

  protected readonly containerClass = computed(() => {
    const classes = ['photo-upload'];

    if (this.dragging()) classes.push('photo-upload--dragging');
    if (this.isDisabled()) classes.push('photo-upload--disabled');
    if (this.resolvedError()) classes.push('photo-upload--invalid');
    if (this.resolvedPreviewUrl()) classes.push('photo-upload--with-preview');

    return classes.join(' ');
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.revokeObjectUrl());
  }

  protected openFilePicker(): void {
    if (this.isDisabled()) {
      return;
    }

    this.fileInput().nativeElement.click();
  }

  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    input.value = '';

    if (!file) {
      return;
    }

    this.processFile(file);
  }

  protected onDragOver(event: DragEvent): void {
    if (this.isDisabled()) {
      return;
    }

    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);

    if (this.isDisabled()) {
      return;
    }

    const file = event.dataTransfer?.files?.[0] ?? null;

    if (!file) {
      return;
    }

    this.processFile(file);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    this.openFilePicker();
  }

  private processFile(file: File): void {
    this.localError.set(null);

    if (!isFileTypeAccepted(file, this.accept())) {
      const message =
        this.invalidTypeMessage() ?? `Supported formats: ${formatAcceptedTypes(this.accept())}.`;

      this.rejectFile(file, 'invalid-type', message);
      return;
    }

    if (file.size > this.maxFileSizeBytes()) {
      const message =
        this.maxSizeMessage() ??
        `The file must be smaller than ${formatFileSize(this.maxFileSizeBytes())}.`;

      this.rejectFile(file, 'file-too-large', message);
      return;
    }

    this.localError.set(null);
    this.selectedFileName.set(file.name);
    this.updatePreview(file);
    this.fileSelected.emit(file);

    const formData = new FormData();
    formData.append(this.fieldName(), file);
    this.formDataSelected.emit(formData);
  }

  private rejectFile(file: File, reason: PhotoUploadRejection['reason'], message: string): void {
    this.localError.set(message);
    this.fileRejected.emit({ file, reason, message });
  }

  private updatePreview(file: File): void {
    if (!this.showPreview()) {
      this.revokeObjectUrl();
      this.selectedPreviewUrl.set(null);
      return;
    }

    if (typeof URL.createObjectURL !== 'function') {
      this.selectedPreviewUrl.set(null);
      return;
    }

    this.revokeObjectUrl();
    this.objectUrl = URL.createObjectURL(file);
    this.selectedPreviewUrl.set(this.objectUrl);
  }

  private revokeObjectUrl(): void {
    if (!this.objectUrl) {
      return;
    }

    if (typeof URL.revokeObjectURL === 'function') {
      URL.revokeObjectURL(this.objectUrl);
    }

    this.objectUrl = null;
  }
}

function formatAcceptedTypes(accept: string): string {
  const tokens = normalizeAcceptTokens(accept);

  if (tokens.length === 0) {
    return 'images';
  }

  return tokens
    .map((token) => {
      if (MIME_TYPE_LABELS[token]) {
        return MIME_TYPE_LABELS[token];
      }

      if (token.startsWith('.')) {
        return token.slice(1).toUpperCase();
      }

      if (token.endsWith('/*')) {
        return `${token.replace('/*', '').toUpperCase()} files`;
      }

      return token.toUpperCase();
    })
    .join(', ');
}

function formatFileSize(sizeInBytes: number): string {
  const sizeInMegabytes = sizeInBytes / (1024 * 1024);

  if (Number.isInteger(sizeInMegabytes)) {
    return `${sizeInMegabytes}MB`;
  }

  return `${sizeInMegabytes.toFixed(1)}MB`;
}

function isFileTypeAccepted(file: File, accept: string): boolean {
  const tokens = normalizeAcceptTokens(accept);

  if (tokens.length === 0) {
    return true;
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith('.')) {
      return fileName.endsWith(token);
    }

    if (token.endsWith('/*')) {
      const [group] = token.split('/');
      return fileType.startsWith(`${group}/`);
    }

    return fileType === token;
  });
}

function normalizeAcceptTokens(accept: string): string[] {
  return accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}
