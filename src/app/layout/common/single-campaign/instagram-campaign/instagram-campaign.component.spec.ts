import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstagramCampaignComponent } from './instagram-campaign.component';

describe('InstagramCampaignComponent', () => {
  let component: InstagramCampaignComponent;
  let fixture: ComponentFixture<InstagramCampaignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstagramCampaignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstagramCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
