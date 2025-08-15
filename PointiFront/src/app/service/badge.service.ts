import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BadgeService {
  private apiUrl = 'http://localhost:8080/badges';

  constructor(private http: HttpClient) {}

  getBadges(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }
}
