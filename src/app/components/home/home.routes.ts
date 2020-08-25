import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SociosnegociosComponent } from '../datosmaestros/sociosnegocios/sociosnegocios.component';
import { ArticulosComponent } from '../datosmaestros/articulos/articulos.component';
import { CotizacionComponent } from '../ventas/cotizacion/cotizacion.component';
import { PedidoComponent } from '../ventas/pedido/pedido.component';
import { CrmComponent } from '../crm/crm.component';
import { SOCIOSNEGOCIOS_ROUTES } from '../datosmaestros/sociosnegocios/sociosnegocios.routes';
import { ARTICULO_ROUTES } from '../datosmaestros/articulos/articulos.routes';
import { CRM_ROUTES } from '../crm/crm.routes';
import { ReportesComponent } from '../reportes/reportes.component';

export const HOME_ROUTES: Routes = [
    { path: 'dashboard'           , component: DashboardComponent },
    { path: 'sn'                  , component: SociosnegociosComponent     , children: SOCIOSNEGOCIOS_ROUTES  },
    { path: 'articulos'           , component: ArticulosComponent          , children: ARTICULO_ROUTES },
    { path: 'cotizacion'          , component: CotizacionComponent },
    { path: 'pedido'              , component: PedidoComponent },
    { path: 'crm'                 , component: CrmComponent                , children: CRM_ROUTES },
    { path: 'reporte'             , component: ReportesComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'dashboard'}
];
