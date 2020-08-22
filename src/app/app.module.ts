import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChartsModule} from 'ng2-charts';
import { AppRoutingModule } from './app.routes';

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
import { ArticulosNuevoComponent } from './components/datosmaestros/articulos/articulos-nuevo.component';
import { ArticulosEditarComponent } from './components/datosmaestros/articulos/articulos-editar.component';
import { SociosNegociosNuevoComponent } from './components/datosmaestros/sociosnegocios/sociosnegocios-nuevo.component';
import { SociosNegociosEditarComponent } from './components/datosmaestros/sociosnegocios/sociosnegocios-editar.component';
import { SociosNegociosListaComponent } from './components/datosmaestros/sociosnegocios/sociosnegocios-lista.component';
import { ArticulosListaComponent } from './components/datosmaestros/articulos/articulos-lista.component';

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
    ArticulosNuevoComponent,
    ArticulosEditarComponent,
    ArticulosListaComponent,
    SociosNegociosNuevoComponent,
    SociosNegociosEditarComponent,
    SociosNegociosListaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
