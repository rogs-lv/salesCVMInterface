import { Routes } from '@angular/router';

import { ArticulosNuevoComponent } from './articulos-nuevo.component';
import { ArticulosEditarComponent } from './articulos-editar.component';
import { ArticulosListaComponent } from './articulos-lista.component';


export const ARTICULO_ROUTES: Routes = [
    { path: 'nuevo'         , component: ArticulosNuevoComponent },
    { path: 'editar'        , component: ArticulosEditarComponent },
    { path: 'lista'         , component: ArticulosListaComponent },
    { path: '**'            , pathMatch: 'full'                , redirectTo: 'lista' }
];

