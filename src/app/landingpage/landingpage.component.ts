import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from "@angular/core"
import { CommonModule, isPlatformBrowser } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ButtonModule } from "primeng/button"
import { CardModule } from "primeng/card"

import { LandingnavbarComponent } from "./landingnavbar/landingnavbar.component";
import { LandingfooterComponent } from "./landingfooter/landingfooter.component";
import { ThemeService } from "../Services/Theme/theme.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule, LandingnavbarComponent, LandingfooterComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  private themeSubscription?: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Add smooth scroll behavior
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Subscribe to theme changes
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  scrollToSection(sectionId: string): void {
    if (isPlatformBrowser(this.platformId)) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  }
}
