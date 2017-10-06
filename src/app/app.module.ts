import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropDirectiveModule } from 'angular4-drag-drop';
import { AppComponent } from './app.component';
import { DropAreaComponent } from './drop-area/drop-area.component';
import { NavigationComponent } from './navigation/navigation.component';
import { GenericBoxModule } from './generic-box/generic-box.module';
import { TypeCheckModule } from './type-check/type-check.module';

@NgModule({
  imports: [
    BrowserModule,
    GenericBoxModule,
    DragDropDirectiveModule,
    TypeCheckModule
  ],
  declarations: [
    AppComponent,
    DropAreaComponent,
    NavigationComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
