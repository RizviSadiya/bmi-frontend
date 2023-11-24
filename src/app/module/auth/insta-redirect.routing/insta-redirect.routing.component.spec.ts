import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstaRedirect.RoutingComponent } from './insta-redirect.routing.component';

describe('InstaRedirect.RoutingComponent', () => {
  let component: InstaRedirect.RoutingComponent;
  let fixture: ComponentFixture<InstaRedirect.RoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstaRedirect.RoutingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstaRedirect.RoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
