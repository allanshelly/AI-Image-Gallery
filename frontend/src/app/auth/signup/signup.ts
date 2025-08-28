import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth';

const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private authService: AuthService, public router: Router) {}

  async signup() {
    const { data, error } = await this.authService.signup(this.email, this.password);
    if (error) {
      this.message = error.message;
    } else {
      this.router.navigate(['/home']);
    }
  }
}