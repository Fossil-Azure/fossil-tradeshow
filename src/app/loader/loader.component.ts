import { Component, Input } from '@angular/core';
import { LoaderServiceService } from '../../shared/loader/loader-service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
}
