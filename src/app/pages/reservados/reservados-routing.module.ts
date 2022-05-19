import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReservadosComponent } from "./reservados.component";

const routes: Routes = [
    { path: '', component: ReservadosComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ReservadosRoutingModule { }