import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from '../../Component/not-found/not-found.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [CommonModule, NotFoundComponent],
  template: `
    <app-not-found
      title="Oops! Page Not Found"
      message="The page you're looking for seems to have wandered off into the digital void."
      [showSearch]="true"
      [showGoBack]="true"
      [showGoHome]="true"
      [customRoutes]="customRoutes"
      (onSearch)="handleSearch($event)">
    </app-not-found>
  `
})
export class NotFoundPageComponent {
  customRoutes = [
    { label: 'All Documents', path: '/home/Documents' },
    { label: 'Shared Documents', path: '/home/SharedDocuments' },
    { label: 'Folder Manager', path: '/home/Folders' },
    { label: 'Messages', path: '/home/message' }
  ];

  constructor(private router: Router) {}

  handleSearch(query: string): void {
    // Navigate to documents page with search query
    this.router.navigate(['/home/Documents'], {
      queryParams: { search: query }
    });
  }
}
