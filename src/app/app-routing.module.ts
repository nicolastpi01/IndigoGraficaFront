import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/bienvenido' },
  { path: 'bienvenido', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'todos', loadChildren: () => import('./pages/pedidos/pedidos.module').then(m => m.PedidosModule) },
  { path: 'nuevo', loadChildren: () => import('./pages/nuevo/nuevo.module').then(m => m.NuevoModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
