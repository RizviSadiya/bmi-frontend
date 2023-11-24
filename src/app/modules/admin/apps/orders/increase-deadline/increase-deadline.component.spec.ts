import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncreaseDeadlineComponent } from './increase-deadline.component';

describe('IncreaseDeadlineComponent', () => {
  let component: IncreaseDeadlineComponent;
  let fixture: ComponentFixture<IncreaseDeadlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncreaseDeadlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncreaseDeadlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
