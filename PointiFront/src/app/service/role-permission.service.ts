import { Injectable } from "@angular/core"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import  { Observable } from "rxjs"
import  { Role, Permission, RolePermissionRequest } from "../models/role.model"

@Injectable({
  providedIn: "root",
})
export class RolePermissionService {
  private baseUrl = "http://localhost:8080"

  constructor(
    private http: HttpClient) {}

   private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
    });
  }


  createRole(nom: string, description: string) {
  const body = { nom, description };
  return this.http.post('http://localhost:8080/roles', body , { headers: this.getHeaders() });
}

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`http://localhost:8080/roles`, {headers: this.getHeaders()})
  }

  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`http://localhost:8080/permissions`, {headers: this.getHeaders()})
  }

  getRolePermissions(roleId: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`http://localhost:8080/roles/${roleId}/permissions`, {headers: this.getHeaders()})
  }

  deleteRole(id: string): Observable<void> {
  return this.http.delete<void>(`http://localhost:8080/roles/${id}`, {headers: this.getHeaders()});
}

  updateRolePermissions(roleId: string, request: RolePermissionRequest): Observable<any> {
    return this.http.post(`http://localhost:8080/roles/${roleId}/permissions`, request, {headers: this.getHeaders()})
  }
}
