import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminComponent } from "../users/admin/admin.component";
import { UserComponent } from '../users/user/user.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, FormsModule, AdminComponent,UserComponent],
  standalone:true,
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
userRole: string | null = null;

  ngOnInit() {
    this.userRole = localStorage.getItem('user');
  }
}