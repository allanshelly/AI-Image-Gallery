import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private supabaseService: SupabaseService
  ) {}

  async getProtected() {
    const session = await this.supabaseService.getSession();
    if (!session) throw new Error('Not authenticated');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${session.access_token}`,
    });

    return this.http.get(`${environment.apiUrl}/protected`, { headers });
  }
}
