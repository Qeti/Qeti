import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {UserApi} from './lb-services';
import {BaseResource} from './BaseResource';
import {Config} from './config';

@Injectable()
export class UserResource extends BaseResource<UserApi> {

  constructor(api: UserApi, config: Config) {
    super(api, config);
  }

}

