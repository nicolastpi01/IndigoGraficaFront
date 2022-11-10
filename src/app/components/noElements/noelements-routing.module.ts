import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NoElementsComponent } from "./noelements.component";

const routes: Routes = [
    { path: '', component: NoElementsComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NoElementsRoutingModule { }