import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptor } from './services/auth-interceptor.service';
import { provideToastr } from 'ngx-toastr';
import { MatNativeDateModule } from '@angular/material/core';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()), // Habilita el uso de interceptores
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideToastr(),
    importProvidersFrom(MatNativeDateModule),
    providePrimeNG({
      theme: {
        preset: Aura
      },
      translation: {
        accept: 'Aceptar',
        reject: 'Rechazar',
        choose: 'Elegir',
        upload: 'Subir',
        cancel: 'Cancelar',
        clear: 'Limpiar',
        apply: 'Aplicar',

        dayNames: [
          'domingo',
          'lunes',
          'martes',
          'miércoles',
          'jueves',
          'viernes',
          'sábado'
        ],
        dayNamesShort: [
          'dom',
          'lun',
          'mar',
          'mié',
          'jue',
          'vie',
          'sáb'
        ],
        dayNamesMin: [
          'D',
          'L',
          'M',
          'X',
          'J',
          'V',
          'S'
        ],
        monthNames: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        monthNamesShort: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic'
        ],

        today: 'Hoy',
        weekHeader: 'Sem',
        firstDayOfWeek: 1,
        dateFormat: 'dd/mm/yy',

        chooseDate: 'Elegir fecha',
        chooseMonth: 'Elegir mes',
        chooseYear: 'Elegir año',
        prevMonth: 'Mes anterior',
        nextMonth: 'Mes siguiente',
        prevYear: 'Año anterior',
        nextYear: 'Año siguiente',
        prevDecade: 'Década anterior',
        nextDecade: 'Década siguiente'
      }
    }),
    MessageService,
    ConfirmationService,
  ],
};
