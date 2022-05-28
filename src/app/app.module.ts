import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
// import { HttpClientInMemoryWebApiModule, InMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService } from './in-memory-data.service';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { LoginModule } from './pages/login/login.module';
import { RegistrarModule } from './pages/registrar/registrar.module';


registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzBadgeModule,
    NzModalModule,
    NzNotificationModule,
    LoginModule,
    RegistrarModule,
    AppRoutingModule, 

// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
/*
  InMemoryWebApiModule.forRoot(InMemoryDataService),
  HttpClientInMemoryWebApiModule.forRoot(
  InMemoryDataService, { dataEncapsulation: false }
  ),
  */ 
  AppRoutingModule

  ],
  providers: [{ provide: NZ_I18N, useValue: es_ES },authInterceptorProviders ],
  bootstrap: [AppComponent]
})
export class AppModule { }
