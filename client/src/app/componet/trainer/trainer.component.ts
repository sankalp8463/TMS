import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { TrainerService } from 'src/app/service/trainer/trainer.service';
interface Course {
  _id: string;
  name: string;
}
@Component({
  selector: 'app-trainer',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit{
   trainers: any;
  message: string | undefined;
  courses: Course[] = [];

   constructor( private trainerService: TrainerService,
       private courseService: CourseService) {}
  ngOnInit(): void {
    this.loadTrainers();

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
     getSkillsDisplay(skills: string | string[] | undefined): string {
    return Array.isArray(skills) ? skills.join(', ') : (skills || '');
  }

  getCourseName(courseId: string): string {
    return this.courses.find(c => c._id === courseId)?.name || 'Unknown Course';
  }
}
