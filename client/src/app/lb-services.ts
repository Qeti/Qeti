/* tslint:disable */
import {Injectable, Inject, Optional} from 'angular2/core';
import {Http, Headers, Request, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/share';

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

  public getAccessTokenId(): any {
    return this.accessTokenId;
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


/**
 * Default error handler
 */
export class ErrorHandler {
  public handleError(error: Response) {
    return Observable.throw(error.json().error || 'Server error');
  }
}


@Injectable()
export abstract class BaseLoopBackApi {

  protected path: string;

  constructor(
    @Inject(Http) protected http: Http, 
    @Optional() @Inject(ErrorHandler) protected errorHandler: ErrorHandler
  ) {
    if (!errorHandler) {
      this.errorHandler = new ErrorHandler();
    }
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
   * @param string  method    Request method (GET, POST, PUT)
   * @param string  url       Request url (my-host/my-url/:id)
   * @param any     urlParams Values of url parameters
   * @param any     params    Parameters for building url (filter and other)
   * @param any     data      Request body
   */
  public request(method: string, url: string, urlParams: any = {}, 
                 params: any = {}, data: any = null) {
    let requestUrl = url;
    let key: string;
    for (key in urlParams) {
      requestUrl = requestUrl.replace(new RegExp(":" + key + "(\/|$)", "g"), urlParams[key] + "$1");
    }
    let parameters: string[] = [];
    if (auth.getAccessTokenId()) {
      params.access_token = auth.getAccessTokenId();
    }
    for (var param in params) {
      parameters.push(param + '=' + (typeof params[param] === 'object' ? JSON.stringify(params[param]) : params[param]));
    }
    requestUrl += (parameters ? '?' : '') + parameters.join('&');

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    let request = new Request({
      headers: headers,
      method: method,
      url: requestUrl,
      body: data ? JSON.stringify(data) : undefined
    });

    return this.http.request(request)
      .map(res => (res.text() != "" ? res.json() : {}))
      .catch(this.errorHandler.handleError);
  }
}


/**
 * Api for the `User` model.
 */
@Injectable()
export class UserApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, errorHandler);
  }

  /**
   * Find a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __findById__accessTokens(id: any, fk: any) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Delete a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroyById__accessTokens(id: any, fk: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Update a related item by id for accessTokens.
   *
   * @param any id User id
   *
   * @param any fk Foreign key for accessTokens
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __updateById__accessTokens(id: any, fk: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/users/:id/accessTokens/:fk";
    let urlParams: any = {
      id: id,
      fk: fk
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Queries accessTokens of user.
   *
   * @param any id User id
   *
   * @param object filter 
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __get__accessTokens(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Creates a new instance in accessTokens of this model.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public __create__accessTokens(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Deletes all accessTokens of this model.
   *
   * @param any id User id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __delete__accessTokens(id: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/users/:id/accessTokens";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Counts accessTokens of user.
   *
   * @param any id User id
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public __count__accessTokens(id: any, where: any = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/:id/accessTokens/count";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public create(data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/users";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public createMany(data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/users";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public upsert(data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/users";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean}` - 
   */
  public exists(id: any) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @param object filter Filter defining fields and include
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(where: any = undefined, data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/users/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
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

    let url: string = this.getPath() + "/users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public count(where: any = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param any id User id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `User` object.)
   * </em>
   */
  public updateAttributes(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/users/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Create a change stream.
   *
   * @param object data Request data.
   *
   *  - `options` – `{object}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream}` - 
   */
  public createChangeStream(options: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/users/change-stream";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  /**
   * Login a user with username/email and password.
   *
   * @param string include Related objects to include in the response. See the description of return value for more details.
   *   Default value: `user`.
   *
   *  - `rememberMe` - `boolean` - Whether the authentication credentials
   *     should be remembered in localStorage across app/browser restarts.
   *     Default: `true`.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
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
  public login(credentials: any, include: any = "user") {
    let method: string = "POST";

    let url: string = this.getPath() + "/users/login";
    let urlParams: any = {
    };

    let params: any = {};
    if (include !== undefined) {
      params.include = include;
    }

    let result = this.request(method, url, urlParams, params, credentials)
      .share();
      result.subscribe(
        response => {
          auth.setUser(response.id, response.userId, response.user);
          auth.setRememberMe(true);
          auth.save();
        },
        () => null
      );
    return result;
  }

  /**
   * Logout a user with access token.
   *
   * @param object data Request data.
   *
   *  - `access_token` – `{string}` - Do not supply this argument, it is automatically extracted from request headers.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public logout() {
    let method: string = "POST";

    let url: string = this.getPath() + "/users/logout";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params)
      .share();
      result.subscribe(
        () => {
          auth.clearUser();
          auth.clearStorage();
        },
        () => null
      );
    return result;
  }

  /**
   * Confirm a user registration with email verification token.
   *
   * @param string uid 
   *
   * @param string token 
   *
   * @param string redirect 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public confirm(uid: string, token: string, redirect: string = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/users/confirm";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Reset password for a user with email.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public resetPassword(options: any) {
    let method: string = "POST";

    let url: string = this.getPath() + "/users/reset";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, options);
    return result;
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
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   */
  public getCurrent(): any {
    let method: string = "GET";

    let url: string = this.getPath() + "/users" + "/:id";
    let id: any = auth.getCurrentUserId();
    if (id == null) {
      id = '__anonymous__';
    }
    let urlParams: any = {
      id: id
    };

    let result = this.request(method, url, urlParams)
      .share();
      result.subscribe(
        response => {
          auth.setCurrentUserData(response);
          return response.resource;
        },
        () => null
      );
    return result;
  }

  /**
   * Get data of the currently logged user that was returned by the last
   * call to {@link lbServices.User#login} or
   * {@link lbServices.User#getCurrent}. Return null when there
   * is no user logged in or the data of the current user were not fetched
   * yet.
   *
   * @returns object A User instance.
   */
  public getCachedCurrent() {
    return auth.getCurrentUserData();
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
   * @returns object Id of the currently logged-in user or null.
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

  constructor(
    @Inject(Http) http: Http,
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, errorHandler);
  }

  /**
   * Fetches hasOne relation types.
   *
   * @param any id PersistedModel id
   *
   * @param boolean refresh 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public __get__types(id: any, refresh: boolean = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Creates a new instance in types of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public __create__types(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Update types of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public __update__types(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Deletes types of this model.
   *
   * @param any id PersistedModel id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroy__types(id: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public create(data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public createMany(data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public upsert(data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean}` - 
   */
  public exists(id: any) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @param object filter Filter defining fields and include
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(where: any = undefined, data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
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

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public count(where: any = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `Company` object.)
   * </em>
   */
  public updateAttributes(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Companies/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Create a change stream.
   *
   * @param object data Request data.
   *
   *  - `options` – `{object}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream}` - 
   */
  public createChangeStream(options: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies/change-stream";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, options);
    return result;
  }


  /**
   * The name of the model represented by this $resource,
   * i.e. `Company`.
   */
  public getModelName() {
    return "Company";
  }
}

/**
 * Api for the `CompanyType` model.
 */
@Injectable()
export class CompanyTypeApi extends BaseLoopBackApi {

  constructor(
    @Inject(Http) http: Http,
    @Optional() @Inject(ErrorHandler) errorHandler: ErrorHandler
  ) {
    super(http, errorHandler);
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public create(data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/CompanyTypes";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Create a new instance of the model and persist it into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public createMany(data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/CompanyTypes";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Update an existing model instance or insert a new one into the data source.
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public upsert(data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/CompanyTypes";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Check whether a model instance exists in the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `exists` – `{boolean}` - 
   */
  public exists(id: any) {
    let method: string = "GET";

    let url: string = this.getPath() + "/CompanyTypes/:id/exists";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @param object filter Filter defining fields and include
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public findById(id: any, filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/CompanyTypes/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find all instances of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public find(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/CompanyTypes";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Find first instance of the model matched by filter from the data source.
   *
   * @param object filter Filter defining fields, where, include, order, offset, and limit
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public findOne(filter: LoopBackFilterInterface = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/CompanyTypes/findOne";
    let urlParams: any = {
    };

    let params: any = {};
    if (filter !== undefined) {
      params.filter = filter;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Update instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * The number of instances updated
   */
  public updateAll(where: any = undefined, data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/CompanyTypes/update";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Delete a model instance by id from the data source.
   *
   * @param any id Model id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public deleteById(id: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/CompanyTypes/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Count instances of the model matched by where from the data source.
   *
   * @param object where Criteria to match model instances
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `count` – `{number}` - 
   */
  public count(where: any = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/CompanyTypes/count";
    let urlParams: any = {
    };

    let params: any = {};
    if (where !== undefined) {
      params.where = where;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Update attributes for a model instance and persist it into the data source.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public updateAttributes(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/CompanyTypes/:id";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Create a change stream.
   *
   * @param object data Request data.
   *
   *  - `options` – `{object}` - 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * Data properties:
   *
   *  - `changes` – `{ReadableStream}` - 
   */
  public createChangeStream(options: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/CompanyTypes/change-stream";
    let urlParams: any = {
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, options);
    return result;
  }

  /**
   * Fetches hasOne relation types.
   *
   * @param any id PersistedModel id
   *
   * @param boolean refresh 
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public __get__Company__types(id: any, refresh: boolean = undefined) {
    let method: string = "GET";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};
    if (refresh !== undefined) {
      params.refresh = refresh;
    }

    let result = this.request(method, url, urlParams, params);
    return result;
  }

  /**
   * Creates a new instance in types of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public __create__Company__types(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Creates a new instance in types of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object[] An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public __createMany__Company__types(id: any, data: any = undefined) {
    let method: string = "POST";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Update types of this model.
   *
   * @param any id PersistedModel id
   *
   * @param object data Request data.
   *
   * This method expects a subset of model properties as request parameters.
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * <em>
   * (The remote method definition does not provide any description.
   * This usually means the response is a `CompanyType` object.)
   * </em>
   */
  public __update__Company__types(id: any, data: any = undefined) {
    let method: string = "PUT";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params, data);
    return result;
  }

  /**
   * Deletes types of this model.
   *
   * @param any id PersistedModel id
   *
   * @returns object An empty reference that will be
   *   populated with the actual data once the response is returned
   *   from the server.
   *
   * This method returns no data.
   */
  public __destroy__Company__types(id: any) {
    let method: string = "DELETE";

    let url: string = this.getPath() + "/Companies/:id/types";
    let urlParams: any = {
      id: id
    };

    let params: any = {};

    let result = this.request(method, url, urlParams, params);
    return result;
  }


  /**
   * The name of the model represented by this $resource,
   * i.e. `CompanyType`.
   */
  public getModelName() {
    return "CompanyType";
  }
}



