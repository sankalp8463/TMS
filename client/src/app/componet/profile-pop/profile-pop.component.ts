import { Component } from '@angular/core';
import {  Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-profile-pop',
    standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-pop.component.html',
  styleUrls: ['./profile-pop.component.css'],

})
export class ProfilePopComponent {
@Input() user: any = {};
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
  logout() {
  localStorage.clear();
  window.location.href = '/login'; // or use router if injected
}
}
