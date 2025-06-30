import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFlipComponent } from './auth-flip.component';

describe('AuthFlipComponent', () => {
  let component: AuthFlipComponent;
  let fixture: ComponentFixture<AuthFlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthFlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthFlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
