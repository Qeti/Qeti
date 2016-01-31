import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import 'rxjs/add/operator/map';
import {LoopbackApi} from './LoopbackApi';
import {Config} from './config';

@Injectable()
export abstract class BaseResource {

  protected api: LoopbackApi;

  constructor(http: Http, protected config: Config) {
    this.api = new LoopbackApi(http, this.getMethodName(), config.apiUrl);
  }

  public abstract getMethodName(): string;

  public getApi(): LoopbackApi {
    return this.api;
  }
}
