import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePopComponent } from './profile-pop.component';

describe('ProfilePopComponent', () => {
  let component: ProfilePopComponent;
  let fixture: ComponentFixture<ProfilePopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilePopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
