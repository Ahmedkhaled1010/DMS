import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ButtonModule } from "primeng/button" // Import PrimeNG ButtonModule
import { CardModule } from "primeng/card" // Import PrimeNG CardModule

import { LandingnavbarComponent } from "./landingnavbar/landingnavbar.component";
import { LandingfooterComponent } from "./landingfooter/landingfooter.component";

@Component({
  selector: 'app-landingpage',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, CardModule,LandingnavbarComponent, LandingfooterComponent],
  templateUrl: './landingpage.component.html',
  styleUrl: './landingpage.component.scss'
})
export class LandingpageComponent {
   features = [
    {
      iconClass: "pi-shield",
      title: "Secure Authentication",
      description: "Robust login and registration with NID verification and encrypted passwords.",
    },
    {
      iconClass: "pi-folder-open",
      title: "Flexible Workspaces",
      description: "Organize documents into custom workspaces (e.g., School, Internship) tailored to your needs.",
    },
    {
      iconClass: "pi-cloud-upload",
      title: "Effortless Document Upload",
      description: "Seamlessly upload multiple documents with metadata management and cloud storage.",
    },
    {
      iconClass: "pi-cloud-download",
      title: "Easy Document Download",
      description: "Securely download any document with proper authorization checks.",
    },
    {
      iconClass: "pi-trash",
      title: "Soft Deletion & Restore",
      description: "Mark documents as deleted without permanent removal, with easy restore options.",
    },
    {
      iconClass: "pi-eye",
      title: "Instant Document Preview",
      description: "Quickly view documents as Base64-encoded data, optimized for various file types.",
    },
    {
      iconClass: "pi-search",
      title: "Advanced Document Search",
      description: "Find documents instantly by name, type, or tags with optimized indexing.",
    },
    {
      iconClass: "pi-lock",
      title: "Granular Access Control",
      description: "Control who sees and interacts with your documents based on roles and permissions.",
    },
    {
      iconClass: "pi-sitemap", // Equivalent to GitBranch
      title: "Document Versioning",
      description: "Track changes and restore previous versions of your documents.",
    },
    {
      iconClass: "pi-tag",
      title: "Smart Document Tagging",
      description: "Categorize and find documents faster with custom tags.",
    },
  ]

  scrollToFeatures(): void {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

}
