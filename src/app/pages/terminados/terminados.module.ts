
import { NgModule } from "@angular/core";
import { TerminadosRoutingModule } from "./terminados-routing.module";
import { TerminadosComponent } from "./terminados.component";


@NgModule({
    imports: [
      TerminadosRoutingModule, 
    ],
    declarations: [TerminadosComponent],
    exports: [TerminadosComponent]
  })
  export class TerminadosModule { }