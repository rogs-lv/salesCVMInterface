import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './app.routes';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SociosnegociosComponent } from './components/datosmaestros/sociosnegocios/sociosnegocios.component';
import { ArticulosComponent } from './components/datosmaestros/articulos/articulos.component';
import { CotizacionComponent } from './components/ventas/cotizacion/cotizacion.component';
import { PedidoComponent } from './components/ventas/pedido/pedido.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    SociosnegociosComponent,
    ArticulosComponent,
    CotizacionComponent,
    PedidoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
