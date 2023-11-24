import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedChannelComponent } from './suggested-channel.component';

describe('SuggestedChannelComponent', () => {
  let component: SuggestedChannelComponent;
  let fixture: ComponentFixture<SuggestedChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuggestedChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
