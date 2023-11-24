import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstaOrderListComponent } from './insta-order-list.component';

describe('InstaOrderListComponent', () => {
  let component: InstaOrderListComponent;
  let fixture: ComponentFixture<InstaOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstaOrderListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
