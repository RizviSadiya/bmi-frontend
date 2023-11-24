import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevealChannelpopupComponent } from './reveal-channelpopup.component';

describe('RevealChannelpopupComponent', () => {
  let component: RevealChannelpopupComponent;
  let fixture: ComponentFixture<RevealChannelpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevealChannelpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevealChannelpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
