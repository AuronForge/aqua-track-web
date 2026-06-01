import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <main class="error-page">
      <section class="error-page__panel">
        <span class="error-page__code">404</span>
        <h1 class="error-page__title">Pagina nao encontrada</h1>
        <p class="error-page__subtitle">
          A rota informada nao existe ou nao esta disponivel neste momento.
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
      background: #fff7ed;
      box-shadow: 0 1rem 3rem rgb(120 53 15 / 0.14);
      text-align: center;
    }

    .error-page__code {
      color: #c2410c;
      font-size: 0.875rem;
      font-weight: 800;
      letter-spacing: 0.16em;
    }

    .error-page__title {
      margin: 0.75rem 0 0;
      color: #7c2d12;
      font-size: 2rem;
    }

    .error-page__subtitle {
      margin: 1rem 0 0;
      color: #9a3412;
      line-height: 1.6;
    }
  `,
})
export class NotFoundComponent {}
