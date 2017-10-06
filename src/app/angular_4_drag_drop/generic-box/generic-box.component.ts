import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-generic-box',
  template: `
    <div class="genericBox">
      {{genericBox.name}}
      <p>{{genericBox.content}}</p>
    </div>
  `
})
export class GenericBoxComponent implements OnInit {
  @Input()
  genericBox: Object;
  constructor() { }

  ngOnInit() {
    if (!this.genericBox) {
      this.genericBox = { name: 'Generic Box 1', content: 'Generic Box 1 Content' }
    }
  }
}