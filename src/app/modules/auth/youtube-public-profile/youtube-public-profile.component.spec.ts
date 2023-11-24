import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubePublicProfileComponent } from './youtube-public-profile.component';

describe('YoutubePublicProfileComponent', () => {
  let component: YoutubePublicProfileComponent;
  let fixture: ComponentFixture<YoutubePublicProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YoutubePublicProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubePublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
