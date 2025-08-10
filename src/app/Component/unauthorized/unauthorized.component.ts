import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ThemeService } from '../../Services/Theme/theme.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent {
  @Input() title: string = 'Access Denied';
  @Input() message: string = 'You do not have permission to perform this action.';
  @Input() showContactAdmin: boolean = true;
  @Input() showGoBack: boolean = true;
  @Input() showGoHome: boolean = true;
  @Input() contactEmail: string = 'admin@example.com';
  @Output() onContactAdmin = new EventEmitter<void>();
  @Output() onGoBack = new EventEmitter<void>();

  isDarkMode: boolean = false;

  constructor(
    private router: Router,
    private themeService: ThemeService
  ) {
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  goBack(): void {
    if (this.onGoBack.observers.length > 0) {
      this.onGoBack.emit();
    } else {
      window.history.back();
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  contactAdmin(): void {
    if (this.onContactAdmin.observers.length > 0) {
      this.onContactAdmin.emit();
    } else {
      window.location.href = `mailto:${this.contactEmail}?subject=Access Request&body=I need access to perform an action that was denied.`;
    }
  }
}
