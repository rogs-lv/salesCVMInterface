import { Routes } from '@angular/router';

import { SociosNegociosNuevoComponent } from './sociosnegocios-nuevo.component';
import { SociosNegociosEditarComponent } from './sociosnegocios-editar.component';
import { SociosNegociosListaComponent } from './sociosnegocios-lista.component';

export const SOCIOSNEGOCIOS_ROUTES: Routes = [
    { path: 'nuevo'          , component: SociosNegociosNuevoComponent },
    { path: 'editar'         , component: SociosNegociosEditarComponent },
    { path: 'lista'          , component: SociosNegociosListaComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'lista' }
];

