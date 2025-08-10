import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WorkspaceService } from '../../Services/Workspace/workspace.service';
import { Workspace } from '../../Interfaces/Workspace/workspace';
import { WorkspaceLabelComponent } from "../Workspace/workspace-label/workspace-label.component";
import { WorkspacesComponent } from "../Workspace/workspaces/workspaces.component";
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ThemeService } from '../../Services/Theme/theme.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [TranslateModule, RouterLink, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit, OnDestroy {
  private mobileOpenSubject = new BehaviorSubject<boolean>(false)
  public mobileOpen$ = this.mobileOpenSubject.asObservable()
  isDarkMode: boolean = false;
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  toggleMobileSidebar(): void {
    this.mobileOpenSubject.next(!this.mobileOpenSubject.value)
    this.updateBodyClass()
  }

  closeMobileSidebar(): void {
    this.mobileOpenSubject.next(false)
    this.updateBodyClass()
  }

  openMobileSidebar(): void {
    this.mobileOpenSubject.next(true)
    this.updateBodyClass()
  }

  private updateBodyClass(): void {
    const body = document.body
    const sidebar = document.querySelector(".flex.fixed")
    const overlay = document.querySelector(".sidebar-overlay")

    if (this.mobileOpenSubject.value) {
      body.style.overflow = "hidden"
      sidebar?.classList.add("mobile-open")
      overlay?.classList.add("active")
    } else {
      body.style.overflow = ""
      sidebar?.classList.remove("mobile-open")
      overlay?.classList.remove("active")
    }
  }
}
