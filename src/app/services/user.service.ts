import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterCriteria } from 'src/app/model/FilterCriteria';
import { Urls } from 'src/app/model/Constant';
import { Incident } from 'src/app/model/incident.model';
import { Response } from 'src/app/model/Response';
import { Comment } from 'src/app/model/comment.model';
import { SearchFilter } from 'src/app/model/SearchFilter';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getIncidents(criteria: FilterCriteria<Incident>): Observable<Response<Incident[]>> {
    const params = new HttpParams().set('req', JSON.stringify(criteria));

    return this.httpClient.get<Response<Incident[]>>(`${Urls.BaseApi}incident/getIncidents`, {
      headers: new HttpHeaders()
        .set('accept', 'application/json'),
      params: params,
      responseType: 'json'
    });
  }

  getComments(criteria: FilterCriteria<number>): Observable<Response<Comment[]>> {
    const params = new HttpParams().set('req', JSON.stringify(criteria));

    return this.httpClient.get<Response<Comment[]>>(`${Urls.BaseApi}incident/getComments`, {
      headers: new HttpHeaders()
        .set('accept', 'application/json'),
      params: params,
      responseType: 'json'
    });
  }
}
