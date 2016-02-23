import {UserApi} from '../../lb-services';
import {Http} from 'angular2/http';
//import {Config} from '../../config';

export class UserService extends UserApi {

  constructor(http: Http) {
    super(http);
  }

}

