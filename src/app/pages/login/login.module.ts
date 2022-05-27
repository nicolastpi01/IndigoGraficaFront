import { NgModule } from '@angular/core';

import { LoginRoutingModule } from './login-routing.module';

import { LoginComponent } from './login.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from "ng-zorro-antd/button";
import { ReactiveFormsModule } from "@angular/forms";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
    imports: [ 
      NzFormModule, 
      NzButtonModule, 
      ReactiveFormsModule, 
      NzSelectModule, 
      NzGridModule, 
      NzDividerModule, 
      NzCardModule, 
      NzUploadModule, 
      NzSpaceModule,
      NzImageModule,
      NzInputModule,
      NzIconModule,
      NzBadgeModule,
      NzMessageModule,
      NzModalModule,
      NzListModule,
      NzCheckboxModule,
      FormsModule,
      CommonModule,
      NzTabsModule,
      ScrollingModule,
      NzSkeletonModule,
      NzCollapseModule,
      NzAvatarModule,
      NzDatePickerModule,
      NzLayoutModule
    ],
  declarations: [LoginComponent],
  exports: [LoginComponent]
})
export class LoginModule { }
