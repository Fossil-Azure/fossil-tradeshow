import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  userInfo: any;
  userName: any = 'User';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isPasswordValid: boolean = false;
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private api: ApiCallingService,
    private snackBar: MatSnackBar
  ) {
    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.userName = this.userInfo.nameOfUser;
    } else {
      this.userInfo = null;
      api.logout();
    }
  }

  ngOnInit(): void {}

  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "Passwords don't match!";
      return;
    }

    if (this.newPassword.length < 5) {
      this.errorMessage = 'Password must be at least 5 characters long!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Prepare API payload
    const payload = {
      email: this.userInfo.emailId,
      newPassword: this.newPassword,
    };

    this.api.updatePassword(payload.email, payload.newPassword).subscribe({
      next: (response: any) => {
        console.log(response);
        this.snackBar.open(
          'Password Reset Successfully.',
          'Close',
          {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          }
        );
        this.api.logout();
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error)
        this.snackBar.open(
          'Something went wrong.',
          'Close',
          {
            duration: 3000,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          }
        );
        this.errorMessage = error.error || 'Failed to update password!';
      },
    });
  }

  skip(): void {
    this.router.navigate(['/tradshow/home']);
  }

  validatePasswords(): void {
    console.log(this.isPasswordValid);
    // Basic password validation
    const passwordRegex = /^.{5,}$/;

    if (
      this.newPassword === this.confirmPassword &&
      passwordRegex.test(this.newPassword)
    ) {
      this.isPasswordValid = true;
      this.errorMessage = '';
    } else {
      this.isPasswordValid = false;
      this.errorMessage =
        'Passwords must match and should have atleast 5 characters!';
    }
  }
}
