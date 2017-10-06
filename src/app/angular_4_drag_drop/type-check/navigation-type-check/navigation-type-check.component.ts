import { Component, OnInit, Input } from '@angular/core';
import { EmptyEnumClass, TypeCheckEnum } from '../type-check-enum';

@Component({
  selector: 'app-navigation-type-check',
  templateUrl: './navigation-type-check.component.html',
  styleUrls: ['./navigation-type-check.component.css']
})
export class NavigationTypeCheckComponent {
  @Input()
  dropItemType: any;
  private pegType = TypeCheckEnum;
  private itemsToDrop: Array<Object> = [
    { name: 'Square Peg', content: 'description 2', type: TypeCheckEnum.Square },
    { name: 'Round Peg', content: 'description 1', type: TypeCheckEnum.Round }
  ]

  constructor() { }

  private releaseDrop(event) {
    let index = this.itemsToDrop.indexOf(event);

    if (index >= 0) {
      setTimeout(() => {(this.checkType(event,index), 100)});
    }
  }

  private checkType(event, index) {
    if (event.type === this.dropItemType) {
      this.itemsToDrop.splice(index, 1);
    }
  }

  private startDrag(item) {
    console.log('Beginning to drag item: ' + item);
  }

}
