import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageStudyMaterialComponent } from './manage-study-material.component';

describe('ManageStudyMaterialComponent', () => {
  let component: ManageStudyMaterialComponent;
  let fixture: ComponentFixture<ManageStudyMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ ManageStudyMaterialComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageStudyMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
