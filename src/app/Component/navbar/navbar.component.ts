import { Component, input } from '@angular/core';
import { User } from '../../Interfaces/user';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user=input<User>();

}
