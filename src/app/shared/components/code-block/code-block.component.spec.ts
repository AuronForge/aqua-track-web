import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeBlockComponent } from './code-block.component';

const clipboardWriteText = jest.fn().mockResolvedValue(undefined);

@Component({
  standalone: true,
  imports: [CodeBlockComponent],
  template: `<aq-code-block [code]="code()" [language]="language()" />`,
})
class TestHostComponent {
  readonly code = signal('const x = 1;');
  readonly language = signal('typescript');
}

@Component({
  standalone: true,
  imports: [CodeBlockComponent],
  template: `<aq-code-block [code]="code()" />`,
})
class DefaultLanguageHostComponent {
  readonly code = signal('');
}

describe('CodeBlockComponent', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;

  beforeAll(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: clipboardWriteText },
      configurable: true,
    });
  });

  beforeEach(async () => {
    clipboardWriteText.mockClear();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent, DefaultLanguageHostComponent],
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    element = hostFixture.nativeElement;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function getComponent(): CodeBlockComponent {
    return hostFixture.debugElement.children[0].componentInstance;
  }

  function getLangLabel(): HTMLElement {
    return element.querySelector('.code-block__lang') as HTMLElement;
  }

  function getCodeElement(): HTMLElement {
    return element.querySelector('.code-block__code') as HTMLElement;
  }

  function getCopyButton(): HTMLButtonElement {
    return element.querySelector('.code-block__copy') as HTMLButtonElement;
  }

  // ── Creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(getComponent()).toBeTruthy();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('should display the language label', () => {
    expect(getLangLabel().textContent?.trim()).toBe('typescript');
  });

  it('should display the code content', () => {
    expect(getCodeElement().textContent?.trim()).toBe('const x = 1;');
  });

  it('should show "Copiar" on the copy button initially', () => {
    expect(getCopyButton().textContent?.trim()).toContain('Copiar');
  });

  it('should default language to "html" when not provided', () => {
    const defaultFixture = TestBed.createComponent(DefaultLanguageHostComponent);
    defaultFixture.detectChanges();
    const lang = defaultFixture.nativeElement.querySelector('.code-block__lang');
    expect(lang?.textContent?.trim()).toBe('html');
  });

  // ── Input reactivity ───────────────────────────────────────────────────────

  it('should react to code input changes', () => {
    hostFixture.componentInstance.code.set('const y = 2;');
    hostFixture.detectChanges();
    expect(getCodeElement().textContent?.trim()).toBe('const y = 2;');
  });

  it('should react to language input changes', () => {
    hostFixture.componentInstance.language.set('html');
    hostFixture.detectChanges();
    expect(getLangLabel().textContent?.trim()).toBe('html');
  });

  // ── Copy behavior ──────────────────────────────────────────────────────────

  it('should call clipboard.writeText with the current code', async () => {
    getCopyButton().click();
    await Promise.resolve();
    expect(clipboardWriteText).toHaveBeenCalledWith('const x = 1;');
  });

  it('should show "Copiado" after clicking copy', async () => {
    getCopyButton().click();
    await Promise.resolve();
    hostFixture.detectChanges();
    expect(getCopyButton().textContent?.trim()).toContain('Copiado');
  });

  it('should revert to "Copiar" after 2 seconds', async () => {
    jest.useFakeTimers();
    getCopyButton().click();
    await Promise.resolve();
    hostFixture.detectChanges();
    jest.advanceTimersByTime(2000);
    hostFixture.detectChanges();
    expect(getCopyButton().textContent?.trim()).toContain('Copiar');
  });

  it('should clear previous timeout when copy is clicked again before 2 seconds', async () => {
    jest.useFakeTimers();
    getCopyButton().click();
    await Promise.resolve();
    jest.advanceTimersByTime(1000);
    getCopyButton().click();
    await Promise.resolve();
    hostFixture.detectChanges();
    jest.advanceTimersByTime(999);
    hostFixture.detectChanges();
    expect(getCopyButton().textContent?.trim()).toContain('Copiado');
  });
});
