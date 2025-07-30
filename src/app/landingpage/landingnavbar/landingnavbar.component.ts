import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ButtonModule } from "primeng/button" // Import PrimeNG ButtonModule

@Component({
  selector: 'app-landingnavbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  templateUrl: './landingnavbar.component.html',
  styleUrl: './landingnavbar.component.scss'
})
export class LandingnavbarComponent {

}
