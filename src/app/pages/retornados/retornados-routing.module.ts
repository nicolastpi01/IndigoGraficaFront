
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RetornadosComponent } from "./retornados.component";

const routes: Routes = [
    { path: '', component: RetornadosComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class RetornadosRoutingModule { }