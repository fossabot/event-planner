import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, Routes } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { AUTHORITY_ADMIN } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IRole, Role } from 'app/shared/model/role.model';
import { RoleService } from './role.service';
import { RoleComponent } from './role.component';
import { RoleDetailComponent } from './role-detail.component';

@Injectable({ providedIn: 'root' })
export class RoleResolve implements Resolve<IRole> {
  constructor(private service: RoleService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRole> | Observable<never> {
    const name = route.params['name'];
    if (name) {
      return this.service.find(name).pipe(
        flatMap((role: HttpResponse<Role>) => {
          if (role.body) {
            return of(role.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Role());
  }
}

export const roleRoute: Routes = [
  {
    path: '',
    component: RoleComponent,
    data: {
      authorities: [AUTHORITY_ADMIN],
      defaultSort: 'name,asc',
      pageTitle: 'eventPlannerApp.role.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':name/view',
    component: RoleDetailComponent,
    resolve: {
      role: RoleResolve,
    },
    data: {
      authorities: [AUTHORITY_ADMIN],
      pageTitle: 'eventPlannerApp.role.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];