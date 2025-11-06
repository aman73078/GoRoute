
// ****************************************** Angular 14 or below version **********************

import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn:'root',
})
export class AuthServiceGuard implements CanActivate, CanActivateChild{
    constructor(private authService: AuthService,
        private route: Router,
    ){}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean| Observable<boolean> | Promise<boolean> {
        console.log(this.authService.authentication());
        
        if(this.authService.authentication()){
            return true;
        }else{
            this.route.navigate(['overview/auth'])
            return false;
        }
    };

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean>{
        return this.canActivate(childRoute, state);
    }
}