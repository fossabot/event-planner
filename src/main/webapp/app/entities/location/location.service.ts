import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { Location } from 'app/shared/model/location.model';

type EntityResponseType = HttpResponse<Location>;
type EntityArrayResponseType = HttpResponse<Location[]>;

@Injectable({ providedIn: 'root' })
export class LocationService {
  public resourceUrl = SERVER_API_URL + 'api/locations';

  constructor(protected http: HttpClient) {}

  create(location: Location): Observable<EntityResponseType> {
    return this.http.post<Location>(this.resourceUrl, location, { observe: 'response' });
  }

  update(location: Location): Observable<EntityResponseType> {
    return this.http.put<Location>(this.resourceUrl, location, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<Location>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<Location[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
