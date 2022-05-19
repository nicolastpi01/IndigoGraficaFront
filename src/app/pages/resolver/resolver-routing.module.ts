import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ResolverComponent } from "./resolver.component";

const routes: Routes = [
    { path: '', component: ResolverComponent },
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ResolverRoutingModule { }