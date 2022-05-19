import { NgModule } from "@angular/core";
import { ResolverRoutingModule } from "./resolver-routing.module";
import { ResolverComponent } from "./resolver.component";

@NgModule({
    imports: [
      ResolverRoutingModule,
    ],
    declarations: [ResolverComponent],
    exports: [ResolverComponent]
  })
  export class ResolverModule { }