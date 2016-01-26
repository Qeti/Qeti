import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {BaseResource} from './base_resource';
import {Config} from './config';

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

export class CompanyResource extends BaseResource {
  modelName = 'Companies';

  constructor(http: Http, config: Config) {
    super(http, config);
  }

  setModel() {
    this.model = (construct) => {
      return new CompanyModel(construct);
    };
  }
}
