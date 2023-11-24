import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstaRedirectComponent } from './insta-redirect.component';

describe('InstaRedirectComponent', () => {
  let component: InstaRedirectComponent;
  let fixture: ComponentFixture<InstaRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstaRedirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
