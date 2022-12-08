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
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTagModule } from "ng-zorro-antd/tag";
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ChatModule } from "src/app/components/chat/chat.module";
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ComentariosModule } from "src/app/components/comentarios/comentarios.module";


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
      NzCollapseModule,
      NzImageModule,
      NzModalModule,
      ScrollingModule,
      NzInputModule,
      NzTypographyModule,
      NzSkeletonModule,
      NzSpaceModule,
      NzCommentModule,
      NzTagModule, 
      NzCheckboxModule,
      NzTabsModule,
      ChatModule,
      NzToolTipModule,
      ComentariosModule        
    ],
    declarations: [ResolverComponent],
    exports: [ResolverComponent]
  })
  export class ResolverModule { }