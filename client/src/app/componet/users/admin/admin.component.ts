import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/user.service';
import { AuthService } from 'src/app/service/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseComponent } from "./course/course.component";
import { ManageStudyMaterialComponent } from "./manage-study-material/manage-study-material.component";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  standalone:true,
    imports: [CommonModule, FormsModule, CourseComponent, ManageStudyMaterialComponent],

  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  activeTab: string = 'manage';
  categoryTab: string = 'course'; // Add this property

// ...rest of your code...
   filteredUsers: any[] = [];
  searchTerm: string = '';

  // For Add User
  newUser = { name: '', email: '', phone: '', password: '' };
  addUserMessage = '';

  constructor(private userService: UserService, private auth: AuthService) {}

  ngOnInit() {
    this.fetchUsers();
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'manage') {
      this.searchTerm = '';
      this.filterUsers();
    }
  }
  filterUsers() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(user =>
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term)
      );
    }
  }

  fetchUsers() {
     this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filterUsers(); // Always update filteredUsers after fetching
      },
      error: (err) => { /* handle error */ }
    });
  }

  promoteToAdmin(user: any) {
    this.userService.makeAdmin(user._id).subscribe({
      next: (res) => {
        this.fetchUsers();
      },
      error: (err) => { /* handle error */ }
    });
  }

  addUser() {
    this.addUserMessage = '';
    this.auth.register(this.newUser).subscribe({
      next: (res) => {
        this.addUserMessage = 'User added successfully!';
        this.newUser = { name: '', email: '', phone: '', password: '' };
        this.fetchUsers();
        this.activeTab = 'manage';
      },
      error: (err) => {
        this.addUserMessage = err.error?.message || 'Failed to add user.';
      }
    });
  }
}