import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { CodeBlockComponent } from '../../../../shared/components/code-block/code-block.component';
import { PhotoUploadRejection } from '../../../../shared/components/photo-upload/photo-upload-rejection.model';
import { PhotoUploadComponent } from '../../../../shared/components/photo-upload/photo-upload.component';

@Component({
  selector: 'app-photo-upload-showcase',
  standalone: true,
  imports: [CodeBlockComponent, PhotoUploadComponent],
  templateUrl: './photo-upload-showcase.component.html',
  styleUrl: './photo-upload-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoUploadShowcaseComponent {
  readonly codeTs = `import { HttpClient } from '@angular/common/http';
import { PhotoUploadComponent } from '../../shared/components/photo-upload/photo-upload.component';

constructor(private readonly http: HttpClient) {}

uploadPhoto(formData: FormData): void {
  this.http.post('/api/uploads/photo', formData).subscribe();
}`;

  readonly codeHtml = `<aq-photo-upload
  fieldName="photo"
  accept="image/jpeg,image/png,image/webp"
  [maxFileSizeBytes]="5 * 1024 * 1024"
  [showPreview]="true"
  (formDataSelected)="uploadPhoto($event)"
/>`;

  readonly selectedFileName = signal<string | null>(null);
  readonly selectedFieldName = signal<string | null>(null);
  readonly rejectionMessage = signal<string | null>(null);

  onFileSelected(file: File): void {
    this.selectedFileName.set(file.name);
    this.rejectionMessage.set(null);
  }

  onFormDataSelected(formData: FormData): void {
    const firstEntry = formData.entries().next().value as [string, FormDataEntryValue] | undefined;
    this.selectedFieldName.set(firstEntry?.[0] ?? null);
  }

  onFileRejected(rejection: PhotoUploadRejection): void {
    this.rejectionMessage.set(rejection.message);
  }
}
