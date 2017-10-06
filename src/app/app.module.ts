import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropDirectiveModule } from 'angular4-drag-drop';
import { AppComponent } from './app.component';
import { AppDragDropComponent } from './angular_4_drag_drop/app.dragdrop.component';
import { DropAreaComponent } from './angular_4_drag_drop/drop-area/drop-area.component';
import { NavigationComponent } from './angular_4_drag_drop/navigation/navigation.component';
import { GenericBoxModule } from './angular_4_drag_drop/generic-box/generic-box.module';
import { TypeCheckModule } from './angular_4_drag_drop/type-check/type-check.module';
import { Ng2Module } from './ng2_drag_drop/ng2.module';
import { Ng2AppComponent } from './ng2_drag_drop/app.ng2.component';

@NgModule({
  imports: [
    BrowserModule,
    GenericBoxModule,
    DragDropDirectiveModule,
    TypeCheckModule,
    Ng2Module
  ],
  declarations: [
    AppComponent,
    AppDragDropComponent,
    DropAreaComponent,
    NavigationComponent,
    Ng2AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
