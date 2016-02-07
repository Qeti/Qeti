import {Injectable} from 'angular2/core';
import {Http, Request} from 'angular2/http';
import 'rxjs/add/operator/map';

export interface LoopBackFilterInterface {
  fields?: any;
  include?: any;
  limit?: any;
  order?: any;
  skip?: any;
  offset?: any;
  where?: any;
}

class LoopBackAuth {
  protected accessTokenId: any;
  protected currentUserId: any;
  protected rememberMe: boolean;
  protected currentUserData: any;

  protected propsPrefix: string = '$LoopBack$';

  constructor() {
    this.accessTokenId = this.load("accessTokenId");
    this.currentUserId = this.load("currentUserId");
    this.rememberMe = this.load("rememberMe");
    this.currentUserData = null;
  }

  public setRememberMe(value: boolean): LoopBackAuth {
    this.rememberMe = value;
    return this;
  }

  public getCurrentUserId(): any {
    return this.currentUserId;
  }

  public setCurrentUserData(data: any): LoopBackAuth {
    this.currentUserData = data;
    return this;
  }

  public getCurrentUserData(): any {
    return this.currentUserData;
  }

  public save() {
    var storage = this.rememberMe ? localStorage : sessionStorage;
    this.saveThis(storage, "accessTokenId", this.accessTokenId);
    this.saveThis(storage, "currentUserId", this.currentUserId);
    this.saveThis(storage, "rememberMe", this.rememberMe);
  };

  public setUser(accessTokenId: any, userId: any, userData: any) {
    this.accessTokenId = accessTokenId;
    this.currentUserId = userId;
    this.currentUserData = userData;
  }

  public clearUser() {
    this.accessTokenId = null;
    this.currentUserId = null;
    this.currentUserData = null;
  }

  public clearStorage() {
    this.saveThis(sessionStorage, "accessTokenId", null);
    this.saveThis(localStorage, "accessTokenId", null);
    this.saveThis(sessionStorage, "currentUserId", null);
    this.saveThis(localStorage, "currentUserId", null);
    this.saveThis(sessionStorage, "rememberMe", null);
    this.saveThis(localStorage, "rememberMe", null);
  };

  // Note: LocalStorage converts the value to string
  // We are using empty string as a marker for null/undefined values.
  protected saveThis(storage: any, name: string, value: any) {
    try {
      var key = this.propsPrefix + name;
      if (value == null) {
        value = '';
      }
      storage[key] = value;
    }
    catch(err) {
      console.log('Cannot access local/session storage:', err);
    }
  }

  protected load(name: string): any {
    var key = this.propsPrefix + name;
    return localStorage[key] || sessionStorage[key] || null;
  }
}

let auth = new LoopBackAuth();

@Injectable()
export abstract class BaseLoopBackApi {

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
   * @param params
   */
  public request(method: string, url: string, urlParams: any = null, 
                 filter: LoopBackFilterInterface = null, data: any = null) {
    return new Promise((resolve, reject) => {
      let requestUrl = url;
      let key: string;
      for (key in urlParams) {
        requestUrl.replace(new RegExp(":" + key + "(\/|$)", "g"), urlParams[key] + "$1");
      }
      if (filter) {
        requestUrl += '?filter=' + JSON.stringify(filter);
      }

      let request = new Request({
        method: method,
        url: requestUrl,
        body: data
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
 * Api for the `User` model.
 */
@Injectable()
export class UserApi extends BaseLoopBackApi {

  constructor(http: Http) {
    super(http);
  }


  /**
   * Find a related item by id for accessTokens.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
   *
   *  - `fk` – `{*}` - Foreign key for accessTokens
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public prototype$__findById__accessTokens(id: any, fk: any) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
  }

  /**
   * Delete a related item by id for accessTokens.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
   *
   *  - `fk` – `{*}` - Foreign key for accessTokens
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
   * This method returns no data.
   */
  public prototype$__destroyById__accessTokens(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
  }

  /**
   * Update a related item by id for accessTokens.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
   *
   *  - `fk` – `{*}` - Foreign key for accessTokens
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public prototype$__updateById__accessTokens(id: any, fk: any, data: any = null) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
  }

  /**
   * Queries accessTokens of User.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
   *
   *  - `filter` – `{object=}` - 
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public prototype$__get__accessTokens(id: any, filter: LoopBackFilterInterface = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = filter;

    return this.request(method, url, urlParams, filterParams);
  }

  /**
   * Creates a new instance in accessTokens of this model.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public prototype$__create__accessTokens(id: any, data: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
  }

  /**
   * Deletes all accessTokens of this model.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
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
   * This method returns no data.
   */
  public prototype$__delete__accessTokens(id: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/Users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
  }

  /**
   * Counts accessTokens of User.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
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
  public prototype$__count__accessTokens(id: any, where: any = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/:id/accessTokens/count";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public create(data: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public createMany(data: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public upsert(data: any = null) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Users";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
  public exists(id: any) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/:id/exists";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = filter;

    return this.request(method, url, urlParams, filterParams);
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = filter;

    return this.request(method, url, urlParams, filterParams);
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/findOne";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = filter;

    return this.request(method, url, urlParams, filterParams);
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
  public updateAll(where: any = null, data: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users/update";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = {
      where: where
    };

    return this.request(method, url, urlParams, filterParams, data);
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public deleteById(id: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
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
  public count(where: any = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/count";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = {
      where: where
    };

    return this.request(method, url, urlParams, filterParams);
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `id` – `{*}` - User id
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
   * This usually means the response is a `User` object.)
   * </em>
   */
  public prototype$updateAttributes(id: any, data: any = null) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Users/:id";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
  public createChangeStream(options: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users/change-stream";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
  }

  /**
   * Login a user with username/email and password.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `include` – `{string=}` - Related objects to include in the response. See the description of return value for more details.
   *   Default value: `user`.
   *
   *  - `rememberMe` - `boolean` - Whether the authentication credentials
   *     should be remembered in localStorage across app/browser restarts.
   *     Default: `true`.
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
   * The response body contains properties of the AccessToken created on login.
   * Depending on the value of `include` parameter, the body may contain additional properties:
   * 
   *   - `user` - `{User}` - Data of the currently logged in user. (`include=user`)
   * 
   *
   */
  public login(credentials: any, include: string = "user") {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users/login";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = {
      include: include
    };

    return this.request(method, url, urlParams, filterParams, credentials)
      .then(function(response: any) {
        var accessToken = response.data;
        auth.setUser(accessToken.id, accessToken.userId, accessToken.user);
        auth.setRememberMe(response.config.params.rememberMe !== false);
        auth.save();
        return response.resource;
      });
  }

  /**
   * Logout a user with access token.
   *
   * @param {Object=} parameters Request parameters.
   *
   *   This method does not accept any parameters.
   *   Supply an empty object or omit this argument altogether.
   *
   * @param {Object} postData Request data.
   *
   *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
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
   * This method returns no data.
   */
  public logout(access_token: string) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users/logout";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams)
      .then(function(response: any) {
        auth.clearUser();
        auth.clearStorage();
        return response.resource;
      });
  }

  /**
   * Confirm a user registration with email verification token.
   *
   * @param {Object=} parameters Request parameters.
   *
   *  - `uid` – `{string}` - 
   *
   *  - `token` – `{string}` - 
   *
   *  - `redirect` – `{string=}` - 
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
   * This method returns no data.
   */
  public confirm(uid: string, token: string, redirect: string = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users/confirm";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
  }

  /**
   * Reset password for a user with email.
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
   * This method returns no data.
   */
  public resetPassword(options: any) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Users/reset";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, options);
  }

  /**
   * @ngdoc method
   * @name lbServices.User#getCurrent
   * @methodOf lbServices.User
   *
   * @description
   *
   * Get data of the currently logged user. Fail with HTTP result 401
   * when there is no user logged in.
   *
   * @param {function(Object,Object)=} successCb
   *    Success callback with two arguments: `value`, `responseHeaders`.
   *
   * @param {function(Object)=} errorCb Error callback with one argument:
   *    `httpResponse`.
   *
   * @returns {Object} An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   */
  public getCurrent(): any {
    let method: string = "GET";

    let url: string = this.getPath() + "/Users" + "/:id";
    let urlParams: any = {
      id: function() {
        var id = auth.getCurrentUserId();
        if (id == null) {
          id = '__anonymous__';
        }
        return id;
      }
    };

    return this.request(method, url, urlParams)
      .then(function(response: any) {
        auth.setCurrentUserData(response.data);
        return response.resource;
      });
  }

  /**
   * Get data of the currently logged user that was returned by the last
   * call to {@link lbServices.User#login} or
   * {@link lbServices.User#getCurrent}. Return null when there
   * is no user logged in or the data of the current user were not fetched
   * yet.
   *
   * @returns {Object} A User instance.
   */
  public getCachedCurrent() {
    var data = auth.getCurrentUserData();
    return data ? new UserApi(data) : null;
  }

  /**
   * @name lbServices.User#isAuthenticated
   *
   * @returns {boolean} True if the current user is authenticated (logged in).
   */
  public isAuthenticated() {
    return this.getCurrentId() != null;
  }

  /**
   * @name lbServices.User#getCurrentId
   *
   * @returns {Object} Id of the currently logged-in user or null.
   */
  public getCurrentId() {
    return auth.getCurrentUserId();
  }

  /**
   * The name of the model represented by this $resource,
   * i.e. `User`.
   */
  public getModelName() {
    return "User";
  }
}




/**
 * Api for the `Company` model.
 */
@Injectable()
export class CompanyApi extends BaseLoopBackApi {

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
  public create(data: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
  public createMany(data: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
  public upsert(data: any = null) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
  public exists(id: any) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/:id/exists";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
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
  public findById(id: any, filter: LoopBackFilterInterface = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/:id";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = filter;

    return this.request(method, url, urlParams, filterParams);
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
  public find(filter: LoopBackFilterInterface = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = filter;

    return this.request(method, url, urlParams, filterParams);
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
  public findOne(filter: LoopBackFilterInterface = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/findOne";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = filter;

    return this.request(method, url, urlParams, filterParams);
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
  public updateAll(where: any = null, data: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies/update";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = {
      where: where
    };

    return this.request(method, url, urlParams, filterParams, data);
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
  public deleteById(id: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/Companies/:id";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
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
  public count(where: any = null) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/count";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = {
      where: where
    };

    return this.request(method, url, urlParams, filterParams);
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
  public prototype$updateAttributes(id: any, data: any = null) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Companies/:id";
    let urlParams: any = {
      id: id
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams, data);
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
  public createChangeStream(options: any = null) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies/change-stream";
    let urlParams: any = {
    };

    let filterParams: LoopBackFilterInterface = null;

    return this.request(method, url, urlParams, filterParams);
  }


  /**
   * The name of the model represented by this $resource,
   * i.e. `Company`.
   */
  public getModelName() {
    return "Company";
  }
}






