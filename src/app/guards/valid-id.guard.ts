import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidIdGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const id = route.paramMap.get('id');

    if (id && !isNaN(+id) && +id > 0) {
      return true;
    }

    this.router.navigate(['/images']);
    return false;
  }
}