import { Routes } from '@angular/router';
import { CrmActividadesComponent } from './crm-actividades/crm-actividades.component';
import { CrmOportunidadesComponent } from './crm-oportunidades/crm-oportunidades.component';

export const CRM_ROUTES: Routes = [
    { path: 'crm-oportunidad', component: CrmOportunidadesComponent },
    { path: 'crm-actividad', component: CrmActividadesComponent },
    { path: '**', pathMatch: 'full', redirectTo: 'crm-oportunidad' }
];
