import { Component } from '@angular/core';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  template: `
    <main class="error-page">
      <section class="error-page__panel">
        <span class="error-page__code">503</span>
        <h1 class="error-page__title">Sistema indisponivel</h1>
        <p class="error-page__subtitle">
          O servico esta temporariamente indisponivel. Tente novamente em instantes.
        </p>
      </section>
    </main>
  `,
  styles: `
    .error-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem;
    }

    .error-page__panel {
      width: min(100%, 32rem);
      padding: 2rem;
      border-radius: 1.5rem;
      background: #eff6ff;
      box-shadow: 0 1rem 3rem rgb(30 64 175 / 0.14);
      text-align: center;
    }

    .error-page__code {
      color: #1d4ed8;
      font-size: 0.875rem;
      font-weight: 800;
      letter-spacing: 0.16em;
    }

    .error-page__title {
      margin: 0.75rem 0 0;
      color: #1e3a8a;
      font-size: 2rem;
    }

    .error-page__subtitle {
      margin: 1rem 0 0;
      color: #1d4ed8;
      line-height: 1.6;
    }
  `,
})
export class ServiceUnavailableComponent {}
