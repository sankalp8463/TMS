// Add this logic to your showcourse.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/service/course.service';

@Component({
  selector: 'app-showcourse',
  templateUrl: './showcourse.component.html',
  styleUrls: ['./showcourse.component.css']
})
export class ShowcourseComponent implements OnInit {
  courses: any[] = [];
  selectedCourse: any = null;

  constructor(private courseService: CourseService, private router: Router) {}

  ngOnInit() {
    this.courseService.getCourses().subscribe({
      next: (courses) => this.courses = courses
    });
  }

  selectCourse(course: any) {
    this.selectedCourse = course;
  }

  onStudyMaterial(course: any) {
    const token = localStorage.getItem('authToken');
    if (token) {
      // User/admin is logged in, navigate to study material page for this course
      this.router.navigate(['/study-material', course._id]);
    } else {
      // Not logged in, redirect to login/register
      this.router.navigate(['/login']);
    }
  }
}