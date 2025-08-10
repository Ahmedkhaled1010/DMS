import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from '../../Component/unauthorized/unauthorized.component';
import { UnauthorizedService, UnauthorizedConfig } from '../../Services/unauthorized/unauthorized.service';

@Component({
  selector: 'app-unauthorized-page',
  standalone: true,
  imports: [CommonModule, UnauthorizedComponent],
  template: `
    <app-unauthorized
      [title]="config.title??'Access Denied'"
      [message]="config.message??'You do not have permission to perform this action.'"
      [showContactAdmin]="config.showContactAdmin??true"
      [showGoBack]="config.showGoBack??true"
      [showGoHome]="config.showGoHome??true"
      [contactEmail]="config.contactEmail??''">
    </app-unauthorized>
  `
})
export class UnauthorizedPageComponent implements OnInit {
  config: UnauthorizedConfig = {
    title: 'Access Denied',
    message: 'You do not have permission to access this page.',
    showContactAdmin: true,
    showGoBack: true,
    showGoHome: true,
    contactEmail: 'admin@example.com'
  };

  constructor(private unauthorizedService: UnauthorizedService) {}

  ngOnInit(): void {
    // Get stored config if available
    const storedConfig = this.unauthorizedService.getStoredConfig();
    if (storedConfig) {
      this.config = { ...this.config, ...storedConfig };
    }
  }
}
