import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'nuevo', loadChildren: () => import('./pages/nuevo/nuevo.module').then(m => m.NuevoModule) },
  { path: 'pedidos', loadChildren: () => import('./pages/pedidos/pedidos.module').then(m => m.PedidosModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
