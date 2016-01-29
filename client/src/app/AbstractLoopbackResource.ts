import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

interface IFilter {
  include?: any;
  where?: any;
}

export abstract class AbstractLoopbackResource {
  private http: Http;
  private model: any;
  private apiUrl: string;

  constructor(entityClass: class, private http: Http, private apiUrl: string = 'api/') {
    this.model = (construct) => {
      return new entityClass(construct);
    };
  }
  
  /**
   * Get model name for building part of URL for API
   * @return string
   */
  abstract public getModelName(): string;

  private mapListToModelList(list: Array<Object>) {
    list.forEach((item, index) => {
      list[index] = this.mapModel(item);
    });

    return list;
  }

  private mapModel(model: any) {
    return this.model(model);
  }

  public search(searchFor: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiUrl + this.getModelName() + '/search/' + searchFor)
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

  public findById(id: number, filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getModelName() + '/get/' + id;
      if (filter) {
        url = url + '?filter=' + JSON.stringify(filter);
      }

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

  public find(filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getModelName();
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

  public count(filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getModelName() + '/count';
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

  public upsert(model) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getModelName();
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      this.http.put(url, JSON.stringify(model), {headers : headers})
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
}