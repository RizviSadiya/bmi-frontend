import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedInviteListComponent } from './suggested-invite-list.component';

describe('SuggestedInviteListComponent', () => {
  let component: SuggestedInviteListComponent;
  let fixture: ComponentFixture<SuggestedInviteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedInviteListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedInviteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
