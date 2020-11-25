import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpInterceptor } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ChartsModule} from 'ng2-charts';
import { AgGridModule } from 'ag-grid-angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routes';
import { CurrencyPipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SociosnegociosComponent } from './components/datosmaestros/sociosnegocios/sociosnegocios.component';
import { ArticulosComponent } from './components/datosmaestros/articulos/articulos.component';
import { CotizacionComponent } from './components/ventas/cotizacion/cotizacion.component';
import { PedidoComponent } from './components/ventas/pedido/pedido.component';
import { CrmComponent } from './components/crm/crm.component';
import { TablaArticulosComponent } from './components/ventas/shared/tabla-articulos/tabla-articulos.component';
import { ListaArticulosComponent } from './components/ventas/shared/lista-articulos/lista-articulos.component';
import { CrmOportunidadesComponent } from './components/crm/crm-oportunidades/crm-oportunidades.component';
import { CrmActividadesComponent } from './components/crm/crm-actividades/crm-actividades.component';
import { ReportesComponent } from './components/reportes/reportes.component';
import { AuthInterceptor } from './services/authconfig.interceptor';
import { ModalComponent } from './components/ventas/shared/modal/modal.component';
import { ListasociosComponent } from './components/datosmaestros/shared/listasocios/listasocios.component';
import { FacturacionPipe } from './pipes/facturacion.pipe';
import { EntregaPipe } from './pipes/entrega.pipe';
import { ToastComponent } from './components/toast/toast.component';
import { EstadosPipe } from './pipes/estados.pipe';
import { ListaarticulosComponent } from './components/datosmaestros/shared/listaarticulos/listaarticulos.component';
import { ModalListaSNComponent } from './components/ventas/shared/modal-lista-sn/modal-lista-sn.component';
import { ListaOppComponent } from './components/crm/shared/lista-opp/lista-opp.component';
import { ListaCRMSociosComponent } from './components/crm/shared/lista-crm-socios/lista-crm-socios.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    SociosnegociosComponent,
    ArticulosComponent,
    CotizacionComponent,
    PedidoComponent,
    CrmComponent,
    TablaArticulosComponent,
    ListaArticulosComponent,
    CrmOportunidadesComponent,
    CrmActividadesComponent,
    ReportesComponent,
    ModalComponent,
    ListasociosComponent,
    FacturacionPipe,
    EntregaPipe,
    ToastComponent,
    EstadosPipe,
    ListaarticulosComponent,
    ModalListaSNComponent,
    ListaOppComponent,
    ListaCRMSociosComponent
  ],
  entryComponents: [
    ModalComponent,
    ModalListaSNComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ChartsModule,
    HttpClientModule,
    NgbModule,
    AgGridModule.withComponents([]),
    NgSelectModule,
    FormsModule,
  ],
  providers: [
    CurrencyPipe
    /* {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    } */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
