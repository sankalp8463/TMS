import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { ProfilePopComponent } from "../profile-pop/profile-pop.component"; // Ensure this path is correct based on your project structure
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone:true,
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  imports: [ProfilePopComponent,CommonModule,RouterLink]
})
export class NavComponent {
  showProfile = false;
  user = {
    name: localStorage.getItem('name')  ,
    email: localStorage.getItem('email')
  };
  constructor(public auth: AuthService) {}
openProfile() {
    // Optionally, fetch user info from backend or localStorage
    this.showProfile = true;
  }
  closeProfile() {
    this.showProfile = false;
  }
}
