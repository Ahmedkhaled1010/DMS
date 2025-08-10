import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { UnauthorizedService, UnauthorizedConfig } from '../../Services/unauthorized/unauthorized.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-unauthorized-modal',
  standalone: true,
  imports: [CommonModule, UnauthorizedComponent],
  template: `
    <div *ngIf="showModal" 
         class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
         (click)="onBackdropClick($event)">
      
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      <!-- Modal Content -->
      <div class="relative z-10 w-full max-w-md transform animate-scale-in"
           (click)="$event.stopPropagation()">
        
        <!-- Close Button -->
        <button (click)="closeModal()"
                class="absolute -top-4 -right-4 z-20 w-8 h-8 rounded-full bg-white shadow-lg border-2 border-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-xl"
                [class.bg-gray-800]="isDarkMode"
                [class.border-gray-600]="isDarkMode">
          <i class="fas fa-times text-sm"
             [class.text-gray-600]="!isDarkMode"
             [class.text-gray-300]="isDarkMode"></i>
        </button>

        <!-- Unauthorized Component -->
        <div class="rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800">
          <app-unauthorized
            [title]="config.title"
            [message]="config.message"
            [showContactAdmin]="config.showContactAdmin"
            [showGoBack]="config.showGoBack"
            [showGoHome]="config.showGoHome"
            [contactEmail]="config.contactEmail"
            (onContactAdmin)="handleContactAdmin()"
            (onGoBack)="handleGoBack()">
          </app-unauthorized>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out;
    }
    
    .animate-scale-in {
      animation: scaleIn 0.2s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes scaleIn {
      from { 
        opacity: 0;
        transform: scale(0.9);
      }
      to { 
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class UnauthorizedModalComponent implements OnInit, OnDestroy {
  showModal = false;
  config: UnauthorizedConfig = {};
  isDarkMode = false;
  
  private subscriptions: Subscription[] = [];

  constructor(private unauthorizedService: UnauthorizedService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.unauthorizedService.showUnauthorized$.subscribe(show => {
        this.showModal = show;
      }),
      
      this.unauthorizedService.config$.subscribe(config => {
        this.config = config;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closeModal(): void {
    this.unauthorizedService.hideUnauthorizedAccess();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  handleContactAdmin(): void {
    this.closeModal();
  }

  handleGoBack(): void {
    this.closeModal();
  }
}
