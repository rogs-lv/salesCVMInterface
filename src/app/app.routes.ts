import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HOME_ROUTES } from './components/home/home.routes';
import { AuthGuard } from './guards/auth.guards.guard';

const routes: Routes =
[
    { path: 'home'            , component: HomeComponent, children: HOME_ROUTES, canActivate: [AuthGuard] },
    { path: 'login'           , component: LoginComponent },
    { path: '**'              , redirectTo: 'login' }
];

@NgModule
    (
    {
        exports: [RouterModule],
        imports: [RouterModule.forRoot(routes)],
    }
    )
export class AppRoutingModule { }
