import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { Router } from '@angular/router';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loginForm: FormGroup;
  hidePassword = true; // Control the password visibility
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private api: ApiCallingService, 
    private router: Router, private loader: LoaderServiceService, private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token && this.isTokenValid(token)) {
      this.router.navigate(['/tradeshow/home']); // Redirect to home if logged in
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now(); // Check if token is expired
    } catch {
      return false; // Invalid token
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword; // Toggle visibility
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.api.login(email, password).subscribe({
        next: (response) => {
          // Save the token and redirect to the dashboard
          this.api.saveToken(response);
          this.isLoading = false;
          this.router.navigate(['/tradeshow/home']);
        },
        error: (error) => {
          // Handle login error
          this.isLoading = false;
          this.errorMessage = 'Invalid username or password';
          if(error.error == "Invalid credentials")
            this.showErrorPopup('Invalid credentials. Please try again.');
          else if(error.error == "User not found")
            this.showErrorPopup('User not found');
        },
      });
    }
  }

  // Getter for the email form control
  get email() {
    return this.loginForm.get('email');
  }

  // Getter for the password form control
  get password() {
    return this.loginForm.get('password');
  }

  // Show error popup using Snackbar
  showErrorPopup(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // 3 seconds
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
