import {Injectable} from 'angular2/core';
import 'rxjs/add/operator/map';
import {Config} from './config';

@Injectable()
export class BaseService<T> {

  constructor(protected api: T, protected config: Config) {
  }

  public getApi(): T {
    return this.api;
  }
}
