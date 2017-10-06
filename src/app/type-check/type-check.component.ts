import { Component } from '@angular/core';
import { TypeCheckEnum } from './type-check-enum';

@Component({
  selector: 'app-type-check',
  templateUrl: './type-check.component.html'
})
export class TypeCheckComponent {
  private title: string = 'Draggable Items that check to see if they are allowed to drop in drop areas';
  private dropItemType: any;

  private dropItemTypeCheck(event) {
    this.dropItemType = event;
  }
}
