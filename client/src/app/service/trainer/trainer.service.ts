import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Trainer interface (could be moved to a models folder)
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

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = 'http://localhost:3000/api/trainers';

  constructor(private http: HttpClient) {}

  // ✅ GET all trainers (public)
  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(this.apiUrl);
  }

  // ✅ GET one trainer by ID (public)
  getTrainerById(id: string): Observable<Trainer> {
    return this.http.get<Trainer>(`${this.apiUrl}/${id}`);
  }

  // ✅ CREATE trainer (admin only)
  addTrainer(formData: FormData): Observable<Trainer> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post<Trainer>(this.apiUrl, formData, { headers });
  }

  // ✅ UPDATE trainer (admin only)
  updateTrainer(id: string, formData: FormData): Observable<Trainer> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.put<Trainer>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  // ✅ DELETE trainer (admin only)
  deleteTrainer(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
