import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Ng2DragDropModule} from "ng2-drag-drop";
import { DemoComponent } from './demo/demo.component';
import { DeleteItemComponent } from './delete-item/delete-item.component';

@NgModule({
    imports: [CommonModule, Ng2DragDropModule.forRoot(), FormsModule],
    declarations: [DemoComponent, DeleteItemComponent],
    exports: [DemoComponent, DeleteItemComponent]
})
export class Ng2Module { }