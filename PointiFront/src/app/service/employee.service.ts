import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  getEmployeesPaginated(page: number, size: number) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
    return this.http.get<any>(`${this.apiUrl}?page=${page}&size=${size}`, { headers });
  }
}
