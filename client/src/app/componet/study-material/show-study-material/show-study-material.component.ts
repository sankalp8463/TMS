import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Import this
import { StudyMaterialService } from 'src/app/service/study-material.service';

@Component({
  selector: 'app-show-study-material',
  standalone: true,
  imports: [CommonModule], // <-- Add this line
  templateUrl: './show-study-material.component.html',
  styleUrls: ['./show-study-material.component.css']
})
export class ShowStudyMaterialComponent implements OnInit {
  courseId: string = '';
  materials: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private studyMaterialService: StudyMaterialService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId') || '';
    if (this.courseId) {
      this.studyMaterialService.getByCourse(this.courseId).subscribe({
        next: (materials) => {
          console.log('API materials:', materials);
          this.materials = materials;
        },
        error: (err) => {
          console.error('Error loading study materials:', err);
        }
      });
    }
  }
}