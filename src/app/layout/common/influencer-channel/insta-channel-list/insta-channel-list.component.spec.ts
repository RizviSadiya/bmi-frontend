import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstaChannelListComponent } from './insta-channel-list.component';

describe('InstaChannelListComponent', () => {
  let component: InstaChannelListComponent;
  let fixture: ComponentFixture<InstaChannelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstaChannelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaChannelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
