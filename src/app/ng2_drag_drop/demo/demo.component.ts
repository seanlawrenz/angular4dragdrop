import { Component } from '@angular/core';
import { Item } from './ng2.item.model'

@Component({
  selector: 'complete-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent {
  vegetables: Item[] = [
    {name: 'Carrot', type: 'vegetable'},
    {name: 'Onion', type: 'vegetable'},
    {name: 'Potato', type: 'vegetable'},
    {name: 'Capsicum', type: 'vegetable'} 
  ];
  fruits: Item[] =[
    {name: 'Apple', type: 'fruit'},
    {name: 'Orange', type: 'fruit'},
    {name: 'Mango', type: 'fruit'},
    {name: 'Banana', type: 'fruit'}
  ];

  droppedFruits = [];
  droppedVegetables = [];
  droppedItems = [];
  fruitDropEnabled = true;
  dragEnabled = true;

  onFruitDrop(event: any) {
    this.droppedFruits.push(event.dragData);
    this.removeItem(event.dragData, this.fruits);
  }

  onVegetableDrop(event: any) {
    this.droppedVegetables.push(event.dragData);
    this.removeItem(event.dragData, this.vegetables);
  }

  onAnyDrop(event: any) {
    this.droppedItems.push(event.dragData);

    if (event.dragData.type === 'vegetable') {
      this.removeItem(event.dragData, this.vegetables);
    }
    else {
      this.removeItem(event.dragData, this.fruits);
    }
  }

  removeItem(item: any, list: Array<Item>) {
    let index = list.map((event) => {
      return event.name
    }).indexOf(item.name);

    list.splice(index, 1);
  }

}
