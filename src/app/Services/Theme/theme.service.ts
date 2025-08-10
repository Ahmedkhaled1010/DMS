import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = new BehaviorSubject<Theme>('light');
  public theme$ = this.currentTheme.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Check for saved theme preference or default to 'light'
      const savedTheme = localStorage.getItem('theme') as Theme;
      
      if (savedTheme) {
        this.setTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark ? 'dark' : 'light');
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      this.currentTheme.next(theme);
      
      // Update DOM
      document.documentElement.setAttribute('data-theme', theme);
      
      // Add/remove dark class for Tailwind
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Save preference
      localStorage.setItem('theme', theme);
      
      // Update meta theme-color for mobile browsers
      this.updateMetaThemeColor(theme);
    }
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme.value === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  getCurrentTheme(): Theme {
    return this.currentTheme.value;
  }

  isDarkMode(): boolean {
    return this.currentTheme.value === 'dark';
  }

  private updateMetaThemeColor(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      const color = theme === 'dark' ? '#0f172a' : '#ffffff';
      
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', color);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = color;
        document.head.appendChild(meta);
      }
    }
  }

  // Utility methods for components
  getThemeClasses(): string {
    return this.isDarkMode() 
      ? 'dark bg-gray-900 text-white' 
      : 'light bg-white text-gray-900';
  }

  getCardClasses(): string {
    return this.isDarkMode()
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white border-gray-200';
  }

  getButtonClasses(): string {
    return this.isDarkMode()
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-100 hover:bg-gray-200 text-gray-900';
  }

  getInputClasses(): string {
    return this.isDarkMode()
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';
  }
}
