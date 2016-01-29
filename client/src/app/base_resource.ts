import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';
import {Config} from './config';

interface IFilter {
  include?: any;
  where?: any;
}

// @todo: make this class as independed service
@Injectable()
export abstract class BaseResource {
  http: Http;
  modelName: string;
  model: any;
  config: Config; // @todo: remove this dependence

  constructor(public http: Http, public config: Config) {
    this.setModel();
  }
  
  abstract setModel(): void;

  search(searchFor: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.config.apiUrl + this.modelName + '/search/' + searchFor)
        .map(res => res.json())
        .subscribe(res => {
          if (res.error) {
            reject(res.error);
          } else {
            resolve(this.mapListToModelList(res));
          }
        });
    });
  }

  mapListToModelList(list: Array<Object>) {
    list.forEach((item, index) => {
      list[index] = this.mapModel(item);
    });

    return list;
  }

  mapModel(model: any) {
    return this.model(model);
  }

  findById(id: number, filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.config.apiUrl + this.modelName + '/get/' + id;
      //if (filter) {
      //  url = url + '?filter=' + JSON.stringify(filter);
      //  console.log('URL', url);
      //}

      this.http.get(url)
        .map(res => res.json())
        .subscribe(res => {
          if (res.error) {
            reject(res.error);
          } else {
            resolve(this.mapModel(res));
          }
        });
    });
  }

  find(filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.config.apiUrl + this.modelName;
      if (filter) {
        url = url + '?filter=' + JSON.stringify(filter);
      }

      this.http.get(url)
        .map(res => res.json())

        .subscribe(res => {
          if (res.error) {
            reject(res.error);
          } else {
            resolve(this.mapListToModelList(res));
          }
        });
    });
  }

  count(filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.config.apiUrl + this.modelName + '/count';
      if (filter) {
        url = url + '?filter=' + JSON.stringify(filter);
      }

      this.http.get(url)
        .map(res => res.json())

        .subscribe(res => {
          if (res.error) {
            reject(res.error);
          } else {
            resolve(res);
          }
        });
    });
  }

  upsert(model) {
    return new Promise((resolve, reject) => {
      let url = this.config.apiUrl + this.modelName;
      //if (filter) {
      //  url = url + '?filter=' + JSON.stringify(filter);
      //  console.log('URL', url);
      //}
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      this.http.put(url, JSON.stringify(model), {headers : headers})
        .map(res => res.json())
        .subscribe(res => {
          console.log(res);
          if (res.error) {
            reject(res.error);
          } else {
            resolve(this.mapModel(res));
          }
        });
    });
  }
}