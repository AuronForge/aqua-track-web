import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'aq-code-block',
  standalone: true,
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input<string>('html');

  protected readonly copied = signal(false);

  private timeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      if (this.timeoutId) clearTimeout(this.timeoutId);
    });
  }

  protected copy(): void {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copied.set(true);
      if (this.timeoutId) clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
