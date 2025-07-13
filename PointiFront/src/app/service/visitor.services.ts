import { HttpClient } from "@angular/common/http";
import { Visitor } from "@angular/compiler";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class VisitorService {
  private baseUrl = 'http://localhost:8080/visiteurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Visitor[]> {
    return this.http.get<Visitor[]>(this.baseUrl);
  }

  create(visitor: Visitor): Observable<Visitor> {
    return this.http.post<Visitor>(this.baseUrl, visitor);
  }

  update(id: number, visitor: Visitor): Observable<Visitor> {
    return this.http.put<Visitor>(`${this.baseUrl}/${id}`, visitor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  assignBadge(visitorId: number, badgeId: string): Observable<Visitor> {
  const url = `http://localhost:8080/visiteurs/${visitorId}/modify-badge/${badgeId}`;
  return this.http.put<Visitor>(url, {});
}

}
