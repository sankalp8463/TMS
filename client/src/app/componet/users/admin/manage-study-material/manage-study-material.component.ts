import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StudyMaterialService } from 'src/app/service/study-material.service';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-manage-study-material',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-study-material.component.html',
  styleUrls: ['./manage-study-material.component.css']
})
export class ManageStudyMaterialComponent implements OnInit {
  courses: any[] = [];
  materials: any[] = [];
  newMaterial: any = { courseId: '', topicName: '', description: '', textContent: '', file: null };
  editMode = false;
  editId: string | null = null;
  message = '';

  constructor(private studyMaterialService: StudyMaterialService, private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
    this.loadMaterials();
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => this.courses = courses
    });
  }

  loadMaterials() {
    if (!this.newMaterial.courseId) return;
    this.studyMaterialService.getByCourse(this.newMaterial.courseId).subscribe({
      next: (materials) => this.materials = materials
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newMaterial.file = file;
    }
  }

  addOrUpdateMaterial() {
    const formData = new FormData();
    formData.append('courseId', this.newMaterial.courseId);
    formData.append('topicName', this.newMaterial.topicName);
    formData.append('description', this.newMaterial.description);
    formData.append('textContent', this.newMaterial.textContent);
    if (this.newMaterial.file) {
      formData.append('file', this.newMaterial.file);
    }

    if (this.editMode && this.editId) {
      this.studyMaterialService.update(this.editId, formData).subscribe({
        next: () => {
          this.message = 'Study material updated!';
          this.resetForm();
          this.loadMaterials();
        },
        error: (err) => this.message = err.error?.message || 'Failed to update.'
      });
    } else {
      this.studyMaterialService.create(formData).subscribe({
        next: () => {
          this.message = 'Study material added!';
          this.resetForm();
          this.loadMaterials();
        },
        error: (err) => this.message = err.error?.message || 'Failed to add.'
      });
    }
  }

  editMaterial(mat: any) {
    this.editMode = true;
    this.editId = mat._id;
    this.newMaterial = {
      courseId: mat.courseId,
      topicName: mat.topicName,
      description: mat.description,
      textContent: mat.textContent,
      file: null
    };
    this.message = '';
  }

  deleteMaterial(id: string) {
    if (!confirm('Delete this study material?')) return;
    this.studyMaterialService.delete(id).subscribe({
      next: () => {
        this.message = 'Deleted!';
        this.loadMaterials();
      },
      error: (err) => this.message = err.error?.message || 'Failed to delete.'
    });
  }

  resetForm() {
    this.editMode = false;
    this.editId = null;
    this.newMaterial = { courseId: '', topicName: '', description: '', textContent: '', file: null };
  }
}