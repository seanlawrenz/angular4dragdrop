import { Component, Output, EventEmitter } from '@angular/core';
import { EmptyEnumClass, TypeCheckEnum } from '../type-check-enum';

@Component({
  selector: 'app-drop-area-type-check',
  templateUrl: './drop-area-type-check.component.html',
  styleUrls: ['./drop-area-type-check.component.css']
})
export class DropAreaTypeCheckComponent {
  private itemsDroppedRound: Array<any> = [];
  private itemsDroppedSquare: Array<any> = [];
  private warningMessage: string = '';
  private highlight: Array<string> = ['',''];
  private typeCheck = TypeCheckEnum;

  @Output() 
  droppedItemType: EventEmitter<any> = new EventEmitter();

  constructor() { }

  private addDropItem(event, type) {
    if (type === TypeCheckEnum.Square) {
      if (event.type === TypeCheckEnum.Square) {
        this.itemsDroppedSquare.push(event);
        this.droppedItemType.emit(event.type);
        this.warningMessage = '';
      }
      else {
        this.warningMessage = 'not a Square, dummy'
      }
    }
    if (type === TypeCheckEnum.Round) {
      if (event.type === TypeCheckEnum.Round) {
        this.itemsDroppedRound.push(event);
        this.droppedItemType.emit(event.type);
        this.warningMessage = '';
      }
      else {
        this.warningMessage = 'Not a round, dummy'
      }
    }
  }

  private dragEnter(event, type) {
    if (event.type !== type) {
      this.highlight[type] = 'badhighlight';
    }
    else {
      this.highlight[type] ='highlight';
    }
  }

  private dragLeave() {
    this.highlight = ['',''];
  }

}
