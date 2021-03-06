import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';

import { User } from './user.model';
import { Project } from 'app/shared/model/project.model';

import { createRequestOption, Pagination } from 'app/shared/util/request-util';

import { SERVER_API_URL } from 'app/app.constants';

type EntityArrayResponseType = HttpResponse<User[]>;

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = SERVER_API_URL + 'api/users';

  constructor(private http: HttpClient) {}

  create(user: User): Observable<User> {
    return this.http.post<User>(this.resourceUrl, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(this.resourceUrl, user);
  }

  find(login: string): Observable<User> {
    return this.http.get<User>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<User[]>> {
    const options = createRequestOption(req);
    return this.http.get<User[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.resourceUrl}/authorities`);
  }

  findByEmailOrLogin(emailOrLogin: string): Observable<User[]> {
    return this.http.post<User[]>(`${this.resourceUrl}/findByEmailOrLogin`, { emailOrLogin });
  }

  findAllByProject(project: Project, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<User[]>(`${this.resourceUrl}/project/${project.id!}`, {
      params: options,
      observe: 'response',
    });
  }
}
