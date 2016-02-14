import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {CompanyApi} from './lb-services';
import {BaseService} from './BaseService';
import {Config} from './config';

@Injectable()
export class CompanyService extends BaseService<CompanyApi> {

  constructor(api: CompanyApi, config: Config) {
    super(api, config);
  }

}

