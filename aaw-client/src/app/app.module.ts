import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { TokenStorage } from './shared/token.storage';
import { StorageServiceModule } from 'angular-webstorage-service';
import { UsersService } from './users.service';
import { RouterAuthService } from './router-auth.service';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { BaseService } from './services/base-service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule,
    HttpClientModule,
    AuthModule,
    StorageServiceModule,
  ],
  providers: [
    UsersService,
    TokenStorage,
    RouterAuthService,
    BaseService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
