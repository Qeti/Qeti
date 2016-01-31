import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {LoopbackApi} from './LoopbackApi';
import {BaseResource} from './BaseResource';
import {Config} from './config';

export class CompanyResource extends BaseResource {

  constructor(http: Http, config: Config) {
    super(http, config);
  }

  public getMethodName(): string {
    return 'Companies';
  }
}
