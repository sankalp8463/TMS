import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courses: any[] = [];
  newCourse: any = { name: '', description: '', image: null };
  editMode = false;
  editId: string | null = null;
  message = '';
  loading = false;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.loadCourses();
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newCourse.image = file;
    }
  }

  addOrUpdateCourse() {
    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.newCourse.name);
    formData.append('description', this.newCourse.description);
    if (this.newCourse.image) {
      formData.append('image', this.newCourse.image);
    }

    if (this.editMode && this.editId) {
      // Update
      this.courseService.updateCourse(this.editId, formData).subscribe({
        next: () => {
          this.message = 'Course updated!';
          this.resetForm();
          this.loadCourses();
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to update course.';
          this.loading = false;
        }
      });
    } else {
      // Add
      this.courseService.addCourse(formData).subscribe({
        next: () => {
          this.message = 'Course added!';
          this.resetForm();
          this.loadCourses();
        },
        error: (err) => {
          this.message = err.error?.message || 'Failed to add course.';
          this.loading = false;
        }
      });
    }
  }

  loadCourses() {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: () => {
        this.courses = [];
        this.loading = false;
      }
    });
  }

  editCourse(course: any) {
    this.editMode = true;
    this.editId = course._id;
    this.newCourse = {
      name: course.name,
      description: course.description,
      image: null // Don't prefill image
    };
    this.message = '';
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.editMode = false;
    this.editId = null;
    this.newCourse = { name: '', description: '', image: null };
    this.loading = false;
  }

  deleteCourse(id: string) {
    if (!confirm('Are you sure you want to delete this course?')) return;
    this.loading = true;
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.message = 'Course deleted!';
        this.loadCourses();
      },
      error: (err) => {
        this.message = err.error?.message || 'Failed to delete course.';
        this.loading = false;
      }
    });
  }
}