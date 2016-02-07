import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {CompanyApi} from './lb-services';
import {BaseResource} from './BaseResource';
import {Config} from './config';

@Injectable()
export class CompanyResource extends BaseResource<CompanyApi> {

  constructor(api: CompanyApi, config: Config) {
    super(api, config);
  }

}

