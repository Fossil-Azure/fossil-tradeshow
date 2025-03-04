import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ApiCallingService } from '../../shared/API/api-calling.service';
import { CartserviceService } from '../../shared/CartService/cartservice.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '500ms ease-in-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class UserProfileComponent {
  userInfo: any;
  user: any;
  isLoading: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  message: string = '';
  errorMessage: string = '';

  @ViewChild('passwordDialog')
  passwordDialog!: TemplateRef<any>;

  constructor(
    private api: ApiCallingService,
    private cartService: CartserviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.cartService.fetchCart();

    const user = localStorage.getItem('user');
    if (user) {
      this.userInfo = JSON.parse(user);
      this.getUserDetails();
    } else {
      this.userInfo = null;
      api.logout();
    }
  }

  getUserDetails() {
    if (!this.userInfo?.emailId) return;

    this.isLoading = true;
    this.api.getUserDetails(this.userInfo.emailId).subscribe({
      next: (response) => {
        this.user = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  openPasswordDialog() {
    this.errorMessage = '';
    this.newPassword = '';
    this.oldPassword = '';
    const dialogRef = this.dialog.open(this.passwordDialog, {
      id: 'passwordDialog',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.isLoading = true;
        this.api.updatePassword(this.user.emailId, this.newPassword).subscribe({
          next: (response: any) => {
            console.log(response);
            this.snackBar.open('Password Reset Successfully.', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
            });
            this.api.logout();
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            console.log(error);
            this.snackBar.open('Something went wrong.', 'Close', {
              duration: 3000,
              verticalPosition: 'bottom',
              horizontalPosition: 'center',
            });
            this.errorMessage = error.error || 'Failed to update password!';
          },
        });
      }
    });
  }

  closeDialog(confirmed: boolean): void {
    if (confirmed) {
      if (this.oldPassword !== this.newPassword) {
        this.errorMessage = 'Password should be same';
      } else if (this.oldPassword.trim() == '' || this.newPassword.trim() == '') {
        this.errorMessage = 'Please enter the valid password';
      } else {
        this.dialog.closeAll();
        this.dialog.getDialogById('passwordDialog')?.close(confirmed);
      }
    } else {
      this.dialog.closeAll();
      this.dialog.getDialogById('passwordDialog')?.close(confirmed);
    }
  }
}
