import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { SecurityAuthModule } from './pages/auth/security-auth.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpAuthAddTokenInterceptor } from './common/auth/interceptors/auth.http.addtoken.interceptor';
import { HttpAuth401ErrorInterceptor } from './common/auth/interceptors/auth.http.error401.interceptor';
import { AppCommonModule } from './common/app.common.module';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppCommonModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    SecurityAuthModule,
    HomeModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    NzMessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuthAddTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpAuth401ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
