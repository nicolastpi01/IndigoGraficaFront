
import { NgModule } from "@angular/core";
import { RetornadosRoutingModule } from "./retornados-routing.module";
import { RetornadosComponent } from "./retornados.component";

@NgModule({
    imports: [
      RetornadosRoutingModule, 
    ],
    declarations: [RetornadosComponent],
    exports: [RetornadosComponent]
  })
  export class RetornadosModule { }