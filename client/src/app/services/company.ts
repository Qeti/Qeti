
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CompanyService {

  constructor(private http: Http) {
  }

  getList(): string {
    return this.http.get("api/Companies")
      .map((res) => res.json());
  }
}