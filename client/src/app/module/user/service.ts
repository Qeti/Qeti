import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {UserApi} from '../../lb-services';
import {BaseService} from '../../BaseService';
import {Config} from '../../config';

@Injectable()
export class UserService extends BaseService<UserApi> {

  constructor(api: UserApi, config: Config) {
    super(api, config);
  }

}

