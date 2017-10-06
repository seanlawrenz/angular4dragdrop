import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropAreaTypeCheckComponent } from './drop-area-type-check.component';

describe('DropAreaTypeCheckComponent', () => {
  let component: DropAreaTypeCheckComponent;
  let fixture: ComponentFixture<DropAreaTypeCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropAreaTypeCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropAreaTypeCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
