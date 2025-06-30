import { Component } from '@angular/core'; // Removed NgModule as it's not used directly here
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Added HttpClientModule
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/service/auth.service'; // Ensure this path is correct based on your project structure
            import { Router } from '@angular/router'; 

import { FormsModule } from '@angular/forms'; // Corrected: Removed NgModel import, only FormsModule is needed

@Component({
  selector: 'app-auth-flip',
  templateUrl: './auth-flip.component.html',
  // FIX: Add FormsModule and HttpClientModule to the imports array for standalone components
  imports: [
    CommonModule,
    FormsModule,         // <--- This is the key change for ngModel
    HttpClientModule     // <--- You also need this for HttpClient to work in standalone components
  ],
  standalone: true,
  styleUrls: ['./auth-flip.component.css']
})
export class AuthFlipComponent {
  flipped = false;

  // Login form fields
  loginData = {
    email: '',
    password: ''
  };
  loginMessage = '';
  loginError = '';

  // Registration form fields
  registerData = {
    name: '',
    email: '',
    password: '',
    phone: ''
  };
  registerMessage = '';
  registerError = '';

  constructor(private auth: AuthService, private router: Router) {}

  flip(event: Event) {
    event.preventDefault();
    this.flipped = !this.flipped;
    // Clear messages when flipping
    this.loginMessage = '';
    this.loginError = '';
    this.registerMessage = '';
    this.registerError = '';
  }

  onRegisterSubmit(event: Event) {
    event.preventDefault();
    this.registerMessage = '';
    this.registerError = '';
     this.auth.register(this.registerData).subscribe({
        next: (res: any) => { // Added 'any' type for res to avoid TS issues if not defined
          this.registerMessage = res.message || 'Registration successful!'; // Use message from backend if available
          // Optionally clear form after successful registration
          this.registerData = { name: '', email: '', password: '', phone: '' };
          setTimeout(() => this.flipped = false, 1200); // Flip back after a short delay
        },
        error: (err: any) => { // Added 'any' type for err
          console.error('Registration error:', err); // Log the full error for debugging
          this.registerError = err.error?.message || 'Registration failed. Please try again.'; // Use error message from backend
        }
      });
  }

  onLoginSubmit(event: Event) {
    event.preventDefault();
    this.loginMessage = '';
    this.loginError = '';
 this.auth.login(this.loginData).subscribe({
        next: (res: any) => { // Added 'any' type for res
          this.loginMessage = res.message || 'Login successful!';
          // IMPORTANT: Handle the token here, e.g., store in localStorage
          if (res.token) {
            localStorage.setItem('authToken', res.token);
            localStorage.setItem('name', res.name); // Make sure your backend sends 'name'
            localStorage.setItem('email', res.email); // Make sure your backend sends 'email'
            // Optionally, store user role or other relevant info
            if (res.role) {
                localStorage.setItem('user', res.role);
            }
            console.log('Login successful, token stored:', res.token);
            // Example: Navigate to a dashboard or home page
            this.router.navigate(['/dashboard']);
          } else {
            console.warn('Login successful, but no token received.');
          }
          // Optionally clear form after successful login
          this.loginData = { email: '', password: '' };
        },
        error: (err: any) => { // Added 'any' type for err
          console.error('Login error:', err); // Log the full error for debugging
          this.loginError = err.error?.message || 'Login failed. Please check your credentials.'; // Use error message from backend
        }
      });
  }
}