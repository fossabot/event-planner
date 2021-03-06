import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event } from 'app/shared/model/event.model';

import { createRequestOption } from 'app/shared/util/request-util';

import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';

type EntityResponseType = HttpResponse<Event>;
type EntityArrayResponseType = HttpResponse<Event[]>;

@Injectable({ providedIn: 'root' })
export class EventService {
  public resourceUrl = SERVER_API_URL + 'api/events';

  constructor(protected http: HttpClient) {}

  create(event: Event): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(event);
    return this.http
      .post<Event>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(event: Event): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(event);
    return this.http
      .put<Event>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<Event>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<Event[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(event: Event): Event {
    const copy: Event = Object.assign({}, event, {
      startTime: event.startTime && event.startTime.isValid() ? event.startTime.toJSON() : undefined,
      endTime: event.endTime && event.endTime.isValid() ? event.endTime.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      this.convertDates(res.body);
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach(this.convertDates);
    }
    return res;
  }

  convertDates(event: Event): Event {
    event.startTime = moment(event.startTime);
    event.endTime = moment(event.endTime);

    const project = event.section.location.project;
    project.startTime = moment(project.startTime);
    project.endTime = moment(project.endTime);

    return event;
  }
}
