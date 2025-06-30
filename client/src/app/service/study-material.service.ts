import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudyMaterialService {
  private apiUrl = 'http://localhost:3000/api/study-materials';

  constructor(private http: HttpClient) {}

  create(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.post(this.apiUrl, formData, { headers });
  }

  update(id: string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.put(`${this.apiUrl}/${id}`, formData, { headers });
  }

  delete(id: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  getByCourse(courseId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/course/${courseId}`);
  }
}