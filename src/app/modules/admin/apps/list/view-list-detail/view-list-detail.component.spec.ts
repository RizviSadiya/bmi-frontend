import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewListDetailComponent } from './view-list-detail.component';

describe('ViewListDetailComponent', () => {
  let component: ViewListDetailComponent;
  let fixture: ComponentFixture<ViewListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewListDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
