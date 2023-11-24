import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPaymentConfirmationComponent } from './review-payment-confirmation.component';

describe('ReviewPaymentConfirmationComponent', () => {
  let component: ReviewPaymentConfirmationComponent;
  let fixture: ComponentFixture<ReviewPaymentConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewPaymentConfirmationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewPaymentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
