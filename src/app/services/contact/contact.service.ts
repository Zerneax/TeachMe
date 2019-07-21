import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  httpOptions = {
    headers: new HttpHeaders( {
      'Content-Type':  'application/json',
      'Authorization': 'token 096ad209c63dc81734529aea9fdf821d6061a956'
    })
  };

  constructor(private httpClient: HttpClient) { }

  createIssueGithub(informations: any) {
    return this.httpClient.post<any>("https://api.github.com/repos/Zerneax/teachme/issues", JSON.stringify(informations), this.httpOptions);
  }
}
