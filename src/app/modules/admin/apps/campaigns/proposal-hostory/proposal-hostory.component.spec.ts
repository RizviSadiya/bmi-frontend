import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalHostoryComponent } from './proposal-hostory.component';

describe('ProposalHostoryComponent', () => {
  let component: ProposalHostoryComponent;
  let fixture: ComponentFixture<ProposalHostoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalHostoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalHostoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
