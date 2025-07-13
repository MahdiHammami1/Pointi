import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
  
})
export class AuthService {

  constructor(
    private router: Router,
    private http: HttpClient


  ) {}

  // ✅ Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // ✅ Récupère l'utilisateur actuel depuis le localStorage
getCurrentUser(): any {
  const userString = localStorage.getItem('user');

  // ✅ Vérifie si null ou "undefined"
  if (!userString || userString === 'undefined') return null;

  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('❌ JSON malformé dans localStorage[user] :', error);
    return null;
  }
}

  // ✅ Récupère les permissions de l'utilisateur
  getCurrentUserPermissions(): string[] {
    const user = this.getCurrentUser();
    return user?.role?.permissions?.map((p: any) => p.nom) || [];
  }

  // ✅ Déconnecte l'utilisateur
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  fetchCurrentUserFromApi(): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) return of(null);

  const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
  return this.http.get<any>('http://localhost:8080/users/me', { headers });
}
 
}
