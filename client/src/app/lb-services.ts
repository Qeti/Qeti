import {Injectable} from 'angular2/core';
import {Http, Request} from 'angular2/http';
import 'rxjs/add/operator/map';


@Injectable()
export class BaseLoopbackApi {

  protected path: string;

  constructor(protected http: Http) {
    this.init();
  }

  /**
   * Get path for building part of URL for API
   * @return string
   */
  protected getPath(): string {
    return this.path;
  }

  protected init() {
    this.path = "/api";
  }

  /**
   * Process request
   */
  public request(requestParams: any, params: any = null) {
    return new Promise((resolve, reject) => {
      let url = requestParams.url;
      if (params && params.filter) {
        url += '?filter=' + JSON.stringify(params.filter);
      }

      let request = new Request({
        method: requestParams.method,
        url: url
      });

      this.http.request(request)
        .map(res => res.json())
        .subscribe(res => {
          if (res.error) {
            reject(res.error);
          }
          else {
            resolve(res);
          }
        });
    });
  }

}



/**
 * Api for the `Company` model.
 */
export class CompanyApi extends BaseLoopbackApi {

  constructor(http: Http) {
    super(http);
  }


  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *   This method does not accept any parameters.
   *   Supply an empty object or omit this argument altogether.
   *
   * @param {Object} postData Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public create(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies",
      method: "POST"
    };
    return this.request(requestParams, params);
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *   This method does not accept any parameters.
   *   Supply an empty object or omit this argument altogether.
   *
   * @param {Object} postData Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @param {function(Array.<Object>,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Array.<Object>} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public createMany(params: any = null) {
    let self = this;
    let requestParams = {
      isArray: true,
      url: self.getPath() + "/Companies",
      method: "POST"
    };
    return this.request(requestParams, params);
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *   This method does not accept any parameters.
   *   Supply an empty object or omit this argument altogether.
   *
   * @param {Object} postData Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public upsert(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies",
      method: "PUT"
    };
    return this.request(requestParams, params);
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - Model id
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean=}` - 
   */
  public exists(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/:id/exists",
      method: "GET"
    };
    return this.request(requestParams, params);
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - Model id
   *
   *  - `filter` – `{object=}` - Filter defining fields and include
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public findById(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/:id",
      method: "GET"
    };
    return this.request(requestParams, params);
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
   *
   * @param {function(Array.<Object>,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Array.<Object>} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public find(params: any = null) {
    let self = this;
    let requestParams = {
      isArray: true,
      url: self.getPath() + "/Companies",
      method: "GET"
    };
    return this.request(requestParams, params);
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `filter` – `{object=}` - Filter defining fields, where, include, order, offset, and limit
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public findOne(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/findOne",
      method: "GET"
    };
    return this.request(requestParams, params);
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `where` – `{object=}` - Criteria to match model instances
   *
   * @param {Object} postData Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/update",
      method: "POST"
    };
    return this.request(requestParams, params);
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - Model id
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public deleteById(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/:id",
      method: "DELETE"
    };
    return this.request(requestParams, params);
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `where` – `{object=}` - Criteria to match model instances
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number=}` - 
   */
  public count(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/count",
      method: "GET"
    };
    return this.request(requestParams, params);
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - PersistedModel id
   *
   * @param {Object} postData Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public prototype$updateAttributes(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/:id",
      method: "PUT"
    };
    return this.request(requestParams, params);
  }

  /**
   * Create a change stream.
   *
   * @param {Object=} parameters Request parameters.
   *
   *   This method does not accept any parameters.
   *   Supply an empty object or omit this argument altogether.
   *
   * @param {Object} postData Request data.
   *
   *  - `options` – `{object=}` - 
   *
   * @param {function(Object,Object)=} successCb
   *   Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *   `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream=}` - 
   */
  public createChangeStream(params: any = null) {
    let self = this;
    let requestParams = {
      url: self.getPath() + "/Companies/change-stream",
      method: "POST"
    };
    return this.request(requestParams, params);
  }


  /**
   * The name of the model represented by this $resource,
   * i.e. `Company`.
   */
  public getModelName() {
    return "Company";
  }
}

