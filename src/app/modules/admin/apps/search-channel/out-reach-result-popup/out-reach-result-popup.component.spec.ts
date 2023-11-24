import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutReachResultPopupComponent } from './out-reach-result-popup.component';

describe('OutReachResultPopupComponent', () => {
  let component: OutReachResultPopupComponent;
  let fixture: ComponentFixture<OutReachResultPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutReachResultPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutReachResultPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
