import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ThemeService } from '../../Services/Theme/theme.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  @Input() title: string = 'Page Not Found';
  @Input() message: string = 'The page you are looking for does not exist or has been moved.';
  @Input() showGoBack: boolean = true;
  @Input() showGoHome: boolean = true;
  @Input() showSearch: boolean = true;
  @Input() customRoutes: Array<{label: string, path: string}> = [];
  @Output() onSearch = new EventEmitter<string>();
  @Output() onGoBack = new EventEmitter<void>();

  isDarkMode: boolean = false;
  searchQuery: string = '';
  suggestedRoutes = [
    { label: 'Dashboard', path: '/home/dashboard', icon: 'fas fa-home' },
    { label: 'Documents', path: '/home/Documents', icon: 'fas fa-file-alt' },
    { label: 'Workspaces', path: '/home/workspaces', icon: 'fas fa-briefcase' },
    { label: 'Profile', path: '/home/profile', icon: 'fas fa-user' }
  ];

  constructor(
    private router: Router,
    private location: Location,
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
      this.location.back();
    }
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      if (this.onSearch.observers.length > 0) {
        this.onSearch.emit(this.searchQuery);
      } else {
        // Default search behavior - navigate to documents with search
        this.router.navigate(['/home/Documents'], { 
          queryParams: { search: this.searchQuery } 
        });
      }
    }
  }

  getCurrentUrl(): string {
    return this.router.url;
  }
}
