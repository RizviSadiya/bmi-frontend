import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInstaChannelsComponent } from './all-insta-channels.component';

describe('AllInstaChannelsComponent', () => {
  let component: AllInstaChannelsComponent;
  let fixture: ComponentFixture<AllInstaChannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInstaChannelsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInstaChannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
