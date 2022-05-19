import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/bienvenido' },
  { path: 'bienvenido', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'todos', loadChildren: () => import('./pages/pedidos/pedidos.module').then(m => m.PedidosModule) },
  { path: 'nuevo', loadChildren: () => import('./pages/nuevo/nuevo.module').then(m => m.NuevoModule) },
  { path: 'reservados', loadChildren: () => import('./pages/reservados/reservados.module').then(m => m.ReservadosModule) },
  { path: 'revision', loadChildren: () => import('./pages/revision/revision.module').then(m => m.RevisionModule) },
  { path: 'retornados', loadChildren: () => import('./pages/retornados/retornados.module').then(m => m.RetornadosModule) },
  { path: 'finalizados', loadChildren: () => import('./pages/terminados/terminados.module').then(m => m.TerminadosModule) },
  { path: 'pedidos/:id',  loadChildren: () => import('./pages/resolver/resolver.module').then(m => m.ResolverModule)  },
  { path: 'carrito',  loadChildren: () => import('./pages/carrito/carrito.module').then(m => m.CarritoModule)  },
  { path: 'editar/:id',  loadChildren: () => import('./pages/editar/editar.module').then(m => m.EditarModule)  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
