
import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CompanyService {

  constructor(private http: Http) {
  }

  getList(): string {
    return this.http.get("data/company_test_data.json")
      .map((res) => res.json());
  }
}