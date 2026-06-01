import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  template: `
    <main class="auth-page">
      <section class="auth-page__panel">
        <span class="auth-page__eyebrow">Recuperacao</span>
        <h1 class="auth-page__title">Esqueci Minha Senha</h1>
        <p class="auth-page__subtitle">
          Estrutura inicial da rota publica para recuperacao de acesso.
        </p>
      </section>
    </main>
  `,
  styles: `
    .auth-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem;
    }

    .auth-page__panel {
      width: min(100%, 28rem);
      padding: 2rem;
      border-radius: 1.5rem;
      background: #ffffff;
      box-shadow: 0 1rem 3rem rgb(15 23 42 / 0.12);
    }

    .auth-page__eyebrow {
      display: inline-block;
      margin-bottom: 0.75rem;
      color: #0f766e;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .auth-page__title {
      margin: 0;
      color: #0f172a;
      font-size: 2rem;
    }

    .auth-page__subtitle {
      margin: 1rem 0 0;
      color: #475569;
      line-height: 1.6;
    }
  `,
})
export class ForgotPasswordComponent {}
