import { Injectable } from '@angular/core';
import { createClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _session: Session | null = null;

  constructor() {
    this.loadSession();
    // listen for changes
    supabase.auth.onAuthStateChange((_event, session) => {
      this._session = session;
      if (session) {
        localStorage.setItem('supabaseSession', JSON.stringify(session));
      } else {
        localStorage.removeItem('supabaseSession');
      }
    });
  }

  private loadSession() {
    const stored = localStorage.getItem('supabaseSession');
    if (stored) {
      this._session = JSON.parse(stored);
    }
  }

  get session(): Session | null {
    return this._session;
  }

  get user(): User | null {
    return this._session?.user ?? null;
  }

  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({ email, password });
  }

  async signup(email: string, password: string) {
    return await supabase.auth.signUp({ email, password });
  }

  async logout() {
    await supabase.auth.signOut();
    this._session = null;
    localStorage.removeItem('supabaseSession');
  }
}
