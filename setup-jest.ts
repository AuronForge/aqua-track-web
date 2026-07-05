import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localePt from '@angular/common/locales/pt';

setupZonelessTestEnv();

registerLocaleData(localePt, 'pt');
registerLocaleData(localePt, 'pt-BR');
registerLocaleData(localeEs, 'es');
