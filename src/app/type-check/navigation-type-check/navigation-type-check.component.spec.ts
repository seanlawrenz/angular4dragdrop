import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTypeCheckComponent } from './navigation-type-check.component';

describe('NavigationTypeCheckComponent', () => {
  let component: NavigationTypeCheckComponent;
  let fixture: ComponentFixture<NavigationTypeCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigationTypeCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationTypeCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
