import { Component } from '@angular/core';

@Component({
  selector: 'delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.css']
})
export class DeleteItemComponent {

  deleteItems: Array<any> =[
    {name: 'Angular2'},
    {name: 'AngularJS'},
    {name: 'Vue'},
    {name: 'ReactJS'},
    {name: 'Backbone'}
  ];

  onDeleteDrop(event: any) {
    this.removeItem(event.dragData, this.deleteItems);
  }

  removeItem(item: any, list: Array<any>) {
    let index = list.map((event) => {
      return event.name
    }).indexOf(item.name);

    list.splice(index, 1);
  }

}
