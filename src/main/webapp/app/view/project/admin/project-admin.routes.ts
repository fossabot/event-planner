import { Routes } from '@angular/router';

import { ProjectResolve } from 'app/entities/project/project.resolve';

import { UserRouteRoleAccessService } from 'app/core/auth/user-route-role-access-service';

import { ProjectAdminComponent } from 'app/view/project/admin/project-admin.component';
import { ProjectLocationsComponent } from 'app/view/project/admin/locations/project-locations.component';
import { ProjectResponsibilitiesComponent } from 'app/view/project/admin/responsibilities/project-responsibilities.component';
import { ProjectUsersComponent } from 'app/view/project/admin/users/project-users.component';

import { ADMIN, SECRETARY } from 'app/shared/constants/role.constants';

export const PROJECT_ADMIN_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'exact',
    component: ProjectAdminComponent,
    data: {
      pageTitle: 'eventPlannerApp.project.admin.tabTitle',
      roles: [ADMIN.name, SECRETARY.name],
    },
    canActivate: [UserRouteRoleAccessService],
    resolve: {
      project: ProjectResolve,
    },
    children: [
      {
        path: 'locations',
        component: ProjectLocationsComponent,
        resolve: {
          project: ProjectResolve,
        },
      },
      {
        path: 'users',
        component: ProjectUsersComponent,
        resolve: {
          project: ProjectResolve,
        },
      },
      {
        path: 'responsibilities',
        component: ProjectResponsibilitiesComponent,
        resolve: {
          project: ProjectResolve,
        },
      },
    ],
  },
];
