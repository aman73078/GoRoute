// ******************************** Angular 15 or above versions ***********************************

import { inject } from "@angular/core"
import { AuthService } from "./auth.service"
import { Router } from "@angular/router";

export const CanActivate = () => {
    const authService:AuthService = inject(AuthService);
    const route:Router = inject(Router);
    if(authService.authentication()){
        return true;
    }else{
        route.navigate(['overview/auth']);
        return false;
    }
}