import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlistDetailComponent } from './viewlist-detail.component';

describe('ViewlistDetailComponent', () => {
  let component: ViewlistDetailComponent;
  let fixture: ComponentFixture<ViewlistDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewlistDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlistDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
