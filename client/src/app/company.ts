import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {LoopbackApi} from './LoopbackApi';
import {BaseResource} from './BaseResource';
import {Config} from './config';

class CompanyModel {
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

  constructor(http: Http, config: Config) {
    super(http, config);
  }

  public getMethodName(): string {
    return 'Companies';
  }
  
  public getEntityClass(): any {
    return CompanyModel;
  }
}
