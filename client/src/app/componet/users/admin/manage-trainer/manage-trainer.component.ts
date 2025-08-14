import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';

import { CourseService } from 'src/app/service/course.service';
import { TrainerService } from 'src/app/service/trainer/trainer.service';

interface Trainer {
  _id?: string;
  name: string;
  education: string;
  skills: string | string[];
  photo?: {
    data?: string;
    contentType?: string;
  };
  courseIds: string[];
}

interface Course {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-manage-trainer',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manage-trainer.component.html',
  styleUrls: ['./manage-trainer.component.css']
})
export class ManageTrainerComponent implements OnInit {
  trainers: Trainer[] = [];
  courses: Course[] = [];
  newTrainer: Trainer = { name: '', education: '', skills: '', courseIds: [] };

  editMode = false;
  message: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private trainerService: TrainerService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadTrainers();
    this.loadCourses();
  }

  loadTrainers(): void {
    this.trainerService.getTrainers().subscribe({
      next: (data) => this.trainers = data,
      error: (err: HttpErrorResponse) => {
        console.error('Error loading trainers:', err);
        this.message = 'Failed to load trainers.';
      }
    });
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (data) => this.courses = data,
      error: (err: HttpErrorResponse) => {
        console.error('Error loading courses:', err);
        this.message = 'Failed to load courses.';
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newTrainer.photo = {
          data: e.target.result,
          contentType: this.selectedFile?.type || ''
        };
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.newTrainer.photo = undefined;
    }
  }

  addOrUpdateTrainer(): void {
    this.message = null;
    const skillsArray = (this.newTrainer.skills as string)
      .split(',').map(s => s.trim()).filter(s => s);

    const formData = new FormData();
    formData.append('name', this.newTrainer.name);
    formData.append('education', this.newTrainer.education);
    formData.append('skills', JSON.stringify(skillsArray));
    formData.append('courseIds', JSON.stringify(this.newTrainer.courseIds));

    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    } else if (this.editMode && this.newTrainer.photo === undefined) {
      formData.append('removePhoto', 'true');
    }

    if (this.editMode && this.newTrainer._id) {
      this.trainerService.updateTrainer(this.newTrainer._id, formData).subscribe({
        next: () => {
          this.message = 'Trainer updated successfully! ✅';
          this.loadTrainers();
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error updating trainer:', err);
          this.message = `Failed to update trainer: ${err.error?.message || err.message} ❌`;
        }
      });
    } else {
      this.trainerService.addTrainer(formData).subscribe({
        next: () => {
          this.message = 'Trainer added successfully! ✅';
          this.loadTrainers();
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error adding trainer:', err);
          this.message = `Failed to add trainer: ${err.error?.message || err.message} ❌`;
        }
      });
    }
    console.log('Form Data:', formData); // Debugging line to check form data
  }

  editTrainer(trainer: Trainer): void {
    this.editMode = true;
    this.newTrainer = {
      ...trainer,
      skills: this.getSkillsDisplay(trainer.skills),
      photo: trainer.photo ? { data: undefined, contentType: trainer.photo.contentType } : undefined
    };
    this.message = null;
  }

  deleteTrainer(id: string | undefined): void {
    if (id && confirm('Are you sure you want to delete this trainer?')) {
      this.trainerService.deleteTrainer(id).subscribe({
        next: () => {
          this.message = 'Trainer deleted successfully! ✅';
          this.loadTrainers();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error deleting trainer:', err);
          this.message = `Failed to delete trainer: ${err.error?.message || err.message} ❌`;
        }
      });
    }
  }

  resetForm(): void {
    this.editMode = false;
    this.newTrainer = { name: '', education: '', skills: '', courseIds: [] };
    this.selectedFile = null;
    this.message = null;
    const fileInput = document.getElementById('trainerPhoto') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  getSkillsDisplay(skills: string | string[] | undefined): string {
    return Array.isArray(skills) ? skills.join(', ') : (skills || '');
  }

  getCourseName(courseId: string): string {
    return this.courses.find(c => c._id === courseId)?.name || 'Unknown Course';
  }

  getSkillsArray(skills: string | string[] | undefined): string[] {
    if (Array.isArray(skills)) {
      return skills;
    }
    return skills ? skills.split(',').map(s => s.trim()) : [];
  }
}
