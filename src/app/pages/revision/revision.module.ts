import { NgModule } from "@angular/core";
import { RevisionRoutingModule } from "./revision-routing.module";
import { RevisionComponent } from "./revision.component";

@NgModule({
    imports: [
      RevisionRoutingModule, 
    ],
    declarations: [RevisionComponent],
    exports: [RevisionComponent]
  })
  export class RevisionModule { }