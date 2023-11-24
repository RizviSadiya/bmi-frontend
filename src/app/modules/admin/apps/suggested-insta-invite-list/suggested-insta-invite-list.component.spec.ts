import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedInstaInviteListComponent } from './suggested-insta-invite-list.component';

describe('SuggestedInstaInviteListComponent', () => {
  let component: SuggestedInstaInviteListComponent;
  let fixture: ComponentFixture<SuggestedInstaInviteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedInstaInviteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedInstaInviteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
