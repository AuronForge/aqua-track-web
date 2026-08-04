# AquaTrack Web

A modern and responsive aquarium management frontend application that provides an intuitive user experience for tracking water parameters, managing aquariums and livestock, monitoring trends, calculating product dosing, handling notifications, and visualizing aquatic ecosystem health through interactive dashboards and analytics.

---

## Stack

| Category        | Technology                        |
| --------------- | --------------------------------- |
| Framework       | Angular 21                        |
| Language        | TypeScript 5.9                    |
| Styles          | SCSS                              |
| Components      | Standalone Components             |
| Testing         | Jest + jest-preset-angular        |
| Linting         | ESLint + @angular-eslint          |
| Style Linting   | StyleLint                         |
| Formatting      | Prettier                          |
| Git Hooks       | Husky                             |
| Staged Files    | Lint-Staged                       |
| Commit Standard | CommitLint + Conventional Commits |
| Changelog       | Standard Version                  |
| Charts          | ApexCharts + ng-apexcharts        |

---

## Prerequisites

- Node.js >= 20
- npm >= 10
- Angular CLI >= 21

```bash
npm install -g @angular/cli@21
```

---

## Installation

```bash
npm install
```

---

## Running locally

```bash
npm start
```

This command starts the app with the Angular `development` configuration.

The application will be available at `http://localhost:4200`.

If you want to be explicit, you can also run:

```bash
npm run start:dev
```

Before running locally, export `DEVELOPMENT_API_BASE_URL` with the API endpoint for the `development` environment.

---

## Lint

Run all linters (TypeScript + SCSS):

```bash
npm run lint
```

Run only TypeScript/Angular lint:

```bash
npm run lint:ts
```

Run only SCSS lint:

```bash
npm run lint:styles
```

Auto-fix all linting issues:

```bash
npm run lint:fix
```

---

## Tests

Run tests once:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

---

## Coverage

Generate coverage report:

```bash
npm run test:coverage
```

Coverage reports are saved to `coverage/aqua-track-web/`.

> **Coverage requirement**: The project enforces a minimum of **85%** global coverage (branches, functions, lines, statements). Each individual TypeScript file in `src/app` must also meet 85% coverage. Commits will be blocked if coverage falls below this threshold.

---

## Build

Default (production) build:

```bash
npm run build
```

Development build:

```bash
npm run build:dev
```

Homologation build:

```bash
npm run build:hom
```

Production build:

```bash
npm run build:prod
```

Environment endpoints currently expected by this repository:

- `development` (`npm start`, `develop`, local): `DEVELOPMENT_API_BASE_URL`
- `homologation` (`release`): `HOMOLOGATION_API_BASE_URL`
- `production`: `API_BASE_URL`

Current values used outside the repository:

- `DEVELOPMENT_API_BASE_URL=https://emily-consent-pharmaceutical-cleaners.trycloudflare.com`
- `HOMOLOGATION_API_BASE_URL=https://patients-tires-treatment-justin.trycloudflare.com`
- `API_BASE_URL=https://scholarship-soccer-lyric-trailer.trycloudflare.com`

Important: each build reads the API URL from its environment variable before `ng serve` or `ng build`. Every value must include the protocol, for example `https://...`.

---

## Release and Changelog

Generate a patch release:

```bash
npm run release
```

Generate a minor release:

```bash
npm run release:minor
```

Generate a major release:

```bash
npm run release:major
```

Standard Version reads commits following the Conventional Commits specification and automatically:

- Bumps the version in `package.json`
- Updates `CHANGELOG.md`
- Creates a git tag

---

## Project Structure

```text
src/
  app/
    core/               # Global resources (auth, config, guards, interceptors, etc.)
      auth/
      config/
      constants/
      guards/
      interceptors/
      layouts/
      models/
      services/
      state/
      utils/

    shared/             # Reusable cross-feature components, pipes, directives
      components/
      directives/
      pipes/
      ui/
      charts/
        base-chart/     # Reusable ApexCharts wrapper component
      forms/

    features/           # Feature modules (domain-driven)
      dashboard/
      aquariums/
      measurements/
      water-parameters/
      alerts/
      users/
      settings/

    app.config.ts
    app.routes.ts
    app.ts
    app.html
    app.scss
    app.spec.ts

  assets/
    icons/
    images/

  environments/
    environment.ts
    environment.development.ts
    environment.homologation.ts
    environment.production.ts
```

---

## Commit Standard

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

Valid commit types:

| Type       | Description                       |
| ---------- | --------------------------------- |
| `feat`     | A new feature                     |
| `fix`      | A bug fix                         |
| `chore`    | Build process or tooling changes  |
| `test`     | Adding or updating tests          |
| `docs`     | Documentation changes             |
| `refactor` | Code refactoring without features |
| `perf`     | Performance improvements          |

Examples:

```bash
git commit -m "feat: add dashboard page"
git commit -m "fix: adjust aquarium measurement chart"
git commit -m "chore: configure eslint"
git commit -m "test: add dashboard unit tests"
git commit -m "docs: update readme"
```

---

## Pre-commit Flow

Every `git commit` triggers the following validation pipeline:

```text
git commit
    ↓
pre-commit hook
    ↓
npm run quality:pre-commit
    ↓
ESLint (TypeScript + Angular templates)
StyleLint (SCSS files)
Prettier check (all files)
Jest coverage >= 85%
    ↓
commit-msg hook
    ↓
CommitLint validates commit message (Conventional Commits)
    ↓
commit allowed ✓
```

### When a commit is blocked

A commit will be **rejected** if any of the following conditions occur:

- ESLint reports errors
- StyleLint reports errors
- Prettier check fails (file not formatted)
- Jest tests fail
- Jest coverage is below 85% globally or per file
- CommitLint rejects the commit message format

---

## quality:pre-commit

The `quality:pre-commit` script runs the full quality pipeline:

```bash
npm run quality:pre-commit
```

This executes in sequence:

1. `npm run lint` — ESLint + StyleLint
2. `npm run format:check` — Prettier check
3. `npm run test:coverage` — Jest with 85% coverage enforcement

You can also run the full quality pipeline manually at any time:

```bash
npm run quality
```

---

## Notes

### TSLint (Legacy)

A `tslint.json` file is present in the root of the project for historical compatibility purposes only. **TSLint is deprecated and must not be used as the primary linting tool.** The official linter for this project is **ESLint** via `@angular-eslint`.

### ApexCharts

[ApexCharts](https://apexcharts.com/) is used as the official charting library via the `ng-apexcharts` Angular wrapper. The reusable `BaseChartComponent` in `src/app/shared/charts/base-chart/` provides a generic wrapper for all charts in the application. Feature components should import and use `BaseChartComponent` rather than `apx-chart` directly.

### Jest

[Jest](https://jestjs.io/) is used as the primary test runner via [jest-preset-angular](https://thymikee.github.io/jest-preset-angular/). The Angular default test setup (Vitest in Angular 21) has been replaced. All tests use the `.spec.ts` extension and are co-located alongside the files they test.

### Coverage Thresholds

- Minimum global coverage: **85%** (branches, functions, lines, statements)
- Minimum per-file coverage: **85%** for all TypeScript files in `src/app`
- Coverage is collected from all `src/app/**/*.ts` files (excluding spec files, route files, index files, and environments)
- Coverage is enforced on every commit via the pre-commit hook
