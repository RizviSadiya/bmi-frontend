import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerInstaProposalComponent } from './influencer-insta-proposal.component';

describe('InfluencerInstaProposalComponent', () => {
  let component: InfluencerInstaProposalComponent;
  let fixture: ComponentFixture<InfluencerInstaProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluencerInstaProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerInstaProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
