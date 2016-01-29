import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {AbstractLoopbackResource} from './AbstractLoopbackResource';
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

@Injectable()
export class CompanyResource extends AbstractLoopbackResource {

  constructor(http: Http, config: Config) {
    super(CompanyModel, http, config.apiUrl);
  }

  public getModelName(): string {
    return 'Companies';
  }
}
