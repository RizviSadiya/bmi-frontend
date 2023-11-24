import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerProposalComponent } from './influencer-proposal.component';

describe('InfluencerProposalComponent', () => {
  let component: InfluencerProposalComponent;
  let fixture: ComponentFixture<InfluencerProposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluencerProposalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
