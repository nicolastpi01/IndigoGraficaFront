

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TerminadosComponent } from "./terminados.component";

const routes: Routes = [
    { path: '', component: TerminadosComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class TerminadosRoutingModule { }