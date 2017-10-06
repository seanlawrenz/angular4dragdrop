import { Component } from '@angular/core';

@Component({
  selector: 'app-drop-area',
  templateUrl: './drop-area.component.html',
  styleUrls: ['./drop-area.component.css']
})
export class DropAreaComponent {
  private itemsDropped: Array<any> = [];

  constructor() { }

  private addDropItem(event) {
    this.itemsDropped.push(event);
  }

}
