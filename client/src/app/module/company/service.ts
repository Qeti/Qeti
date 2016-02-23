import {CompanyApi} from '../../lb-services';
import {Http} from 'angular2/http';
//import {Config} from '../../config';

export class CompanyService extends CompanyApi {

  constructor(http: Http) {
    super(http);
  }

}

