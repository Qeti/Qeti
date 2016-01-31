import {Http, Headers} from 'angular2/http';
import 'rxjs/add/operator/map';

export interface IFilter {
  fields?: any;
  include?: any;
  limit?: any;
  order?: any;
  skip?: any;
  offset?: any;
  where?: any;
}

export class LoopbackApi {

  constructor(private http: Http, private methodName: string, private apiUrl: string = 'api/') {
  }

  /**
   * Get method name for building part of URL for API
   * @return string
   */
  private getMethodName(): string {
    return this.methodName;
  }

  public findById(id: number, filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getMethodName() + '/get/' + id;
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

  public find(filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getMethodName();
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

  public count(filter: IFilter = null) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getMethodName() + '/count';
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

  public upsert(model: any) {
    return new Promise((resolve, reject) => {
      let url = this.apiUrl + this.getMethodName();
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      this.http.put(url, JSON.stringify(model), {headers : headers})
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
}