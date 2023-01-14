import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth-guard.guard';
import { SeccionNoEncontradaComponent } from './pages/seccion-no-encontrada/seccion-no-encontrada.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/bienvenido' },
  { path: 'bienvenido', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'todos', loadChildren: () => import('./pages/pedidos/pedidos.module').then(m => m.PedidosModule), canActivate: [AuthGuard] },
  { path: 'nuevo', loadChildren: () => import('./pages/nuevo/nuevo.module').then(m => m.NuevoModule), canActivate: [AuthGuard] },
  { path: 'reservados', loadChildren: () => import('./pages/reservados/reservados.module').then(m => m.ReservadosModule), canActivate: [AuthGuard] },
  { path: 'revision', loadChildren: () => import('./pages/revision/revision.module').then(m => m.RevisionModule), canActivate: [AuthGuard] },
  { path: 'retornados', loadChildren: () => import('./pages/retornados/retornados.module').then(m => m.RetornadosModule), canActivate: [AuthGuard] },
  { path: 'finalizados', loadChildren: () => import('./pages/terminados/terminados.module').then(m => m.TerminadosModule), canActivate: [AuthGuard] },
  { path: 'pedidos/:id', loadChildren: () => import('./pages/resolver/resolver.module').then(m => m.ResolverModule), canActivate: [AuthGuard]  },
  { path: 'carrito',  loadChildren: () => import('./pages/carrito/carrito.module').then(m => m.CarritoModule), canActivate: [AuthGuard] },
  { path: 'pedidos/editar/:id', loadChildren: () => import('./pages/editar/editar.module').then(m => m.EditarModule), canActivate: [AuthGuard] },
  { path: 'editar/:id', loadChildren: () => import('./pages/nuevo/nuevo.module').then(m => m.NuevoModule), canActivate: [AuthGuard] },
  {path: '404', component: SeccionNoEncontradaComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
