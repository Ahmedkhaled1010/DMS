import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthComponent } from './Pages/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
     {path:"",redirectTo:"login",pathMatch:"full"},
    {path:"login",component:AuthComponent},
    {path:"home",canActivate:[authGuard],component:HomeComponent},

];
