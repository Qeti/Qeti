import {Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ErrorHandler} from '../../lb-services';

export class LoopbackErrorHandler extends ErrorHandler {
  public handleError(error: Response): any {
    console.warn('@todo: error handler');
    return Observable.throw(error.json().error || 'Server error');
  }
}
