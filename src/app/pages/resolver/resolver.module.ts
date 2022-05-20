import { NgModule } from "@angular/core";
import { ResolverRoutingModule } from "./resolver-routing.module";
import { ResolverComponent } from "./resolver.component";
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from "ng-zorro-antd/button";
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

@NgModule({
    imports: [
      ResolverRoutingModule,
      NzGridModule,
      NzDescriptionsModule,
      NzBadgeModule,
      NzListModule,
      NzCardModule,
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NzFormModule,
      NzAvatarModule,
      NzIconModule,
      NzUploadModule,
      NzButtonModule,
      NzCollapseModule     
    ],
    declarations: [ResolverComponent],
    exports: [ResolverComponent]
  })
  export class ResolverModule { }