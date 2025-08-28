import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private supabase: SupabaseService, public router: Router) {}

  async login() {
    const { data, error } = await this.supabase.signIn(this.email, this.password);
    if (error) {
      alert(error.message);
    } else {
      localStorage.setItem('sb-token', data.session?.access_token ?? '');
      this.router.navigate(['/home']);
    }
  }

  async signup() {
    const { data, error } = await this.supabase.signUp(this.email, this.password);
    if (error) {
      alert(error.message);
    } else {
      alert('Signup successful! Please check your email to confirm.');
    }
  }
}
