import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

//@ Angular material modules
import { MatSidenavModule } from '@angular/material/';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
//@ App components
import { AppComponent } from './app.component';
import { MainNavComponent } from './_components/main-nav/main-nav.component';
import { GraphsBoardComponent } from './_components/graphs-board/graphs-board.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    GraphsBoardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
