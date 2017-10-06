import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  private itemsToDrop: Array<Object> = [
    { name: 'Item to drop 1', content: 'description 1' },
    { name: 'Item to drop 2', content: 'description 2' },
    { name: 'Item to drop 3', content: 'description 3' }
  ]
  constructor() { }

  ngOnInit() {
  }
  private releaseDrop(event) {
    let i = this.itemsToDrop.indexOf(event);
    if (i >=0) {
      this.itemsToDrop.splice(i,1);
    }
  }

}
