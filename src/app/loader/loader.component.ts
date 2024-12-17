import { Component } from '@angular/core';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  isLoading: boolean = false;

  constructor(private loaderService: LoaderServiceService) {
    this.loaderService.isLoading.subscribe((value) => {
      this.isLoading = value;
    });
  }
}
