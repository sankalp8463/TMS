import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStudyMaterialComponent } from './show-study-material.component';

describe('ShowStudyMaterialComponent', () => {
  let component: ShowStudyMaterialComponent;
  let fixture: ComponentFixture<ShowStudyMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ShowStudyMaterialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowStudyMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
