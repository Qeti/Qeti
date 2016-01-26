import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {BaseResource} from './base_resource';
import 'rxjs/add/operator/map';


export class CompanyModel {
  id: number;
  Name: string;
  Code: string;
  Description: string;

  constructor(model: any) {
    if (model) {
      this.id = model.id;
      this.Name = model.Name;
      this.Code = model.Code;
      this.Description = model.Description;
    }
  }
}

@Injectable()
export class CompanyResource extends BaseResource {
    http: Http;
    model;
    modelName = 'Companies';

    constructor(http: Http) {
        super(http);

        this.model = (construct) => {
            return new CompanyModel(construct);
        };

        this.http = http;
    }
}
