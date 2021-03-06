import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LocationTimeSlot } from 'app/shared/model/location-time-slot.model';
import { LocationTimeSlotService } from './location-time-slot.service';

@Injectable({ providedIn: 'root' })
export class LocationTimeSlotTimeSlotResolve implements Resolve<LocationTimeSlot> {
  constructor(private service: LocationTimeSlotService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LocationTimeSlot> | Observable<never> {
    let locationTimeSlotId = route.params['locationTimeSlotId'];

    // Search recursively for Route.children
    let parent = route.parent;
    while (!locationTimeSlotId && parent) {
      locationTimeSlotId = parent.params['locationTimeSlotId'];
      parent = parent.parent;
    }

    if (locationTimeSlotId) {
      return this.service.find(locationTimeSlotId).pipe(
        mergeMap((locationTimeSlot: HttpResponse<LocationTimeSlot>) => {
          if (locationTimeSlot.body) {
            return of(locationTimeSlot.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }

    return of({} as LocationTimeSlot);
  }
}
