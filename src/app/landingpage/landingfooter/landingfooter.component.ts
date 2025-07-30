import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"

@Component({
  selector: 'app-landingfooter',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landingfooter.component.html',
  styleUrl: './landingfooter.component.scss'
})
export class LandingfooterComponent {
    currentYear: number = new Date().getFullYear()


}
