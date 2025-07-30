import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from "./Pages/auth/auth.component";
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { UploadComponent } from "./upload/upload.component";
import { AllDocumentComponent } from "./Pages/all-document/all-document.component";
import { LandingpageComponent } from "./landingpage/landingpage.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthComponent, NgxSpinnerModule, UploadComponent, AllDocumentComponent, LandingpageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'DMS';
  constructor(private _NgxSpinnerService:NgxSpinnerService)
  {

  }
  ngOnInit(): void {
    
  }
}
