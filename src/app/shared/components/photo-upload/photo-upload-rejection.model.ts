export interface PhotoUploadRejection {
  readonly reason: 'invalid-type' | 'file-too-large';
  readonly file: File;
  readonly message: string;
}
