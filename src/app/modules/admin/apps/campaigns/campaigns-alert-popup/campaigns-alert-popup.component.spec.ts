import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignsAlertPopupComponent } from './campaigns-alert-popup.component';

describe('CampaignsAlertPopupComponent', () => {
  let component: CampaignsAlertPopupComponent;
  let fixture: ComponentFixture<CampaignsAlertPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaignsAlertPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignsAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
