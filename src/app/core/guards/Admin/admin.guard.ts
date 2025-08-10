import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../../../Interfaces/User/login';
import { inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../Services/Auth/auth.service';
import { UnauthorizedService } from '../../../Services/unauthorized/unauthorized.service';
import { isPlatformBrowser } from '@angular/common';

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const auth = inject(AuthService);
    const unauthorizedService = inject(UnauthorizedService);
    const platformId = inject(PLATFORM_ID);

    let role;
    auth.role.subscribe((res) => {
        role = res;
    });

    let token: string | null = null;
    console.log(role);

    if (isPlatformBrowser(platformId)) {
        token = localStorage.getItem('Token');
       // role = localStorage.getItem("Role");
    }
    console.log(role);

    if (token && role == "ADMIN") {
        return true;
    } else {
        // Use unauthorized service to show proper message
        unauthorizedService.navigateToUnauthorizedPage({
            title: 'Admin Access Required',
            message: 'You need administrator privileges to access this page.',
            showContactAdmin: true,
            showGoBack: true,
            showGoHome: true,
            contactEmail: 'admin@example.com'
        });
        return false;
    }
};
