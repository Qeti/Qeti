import {LoopBackFilterInterface} from '../../lb-services';
import {Observable} from 'rxjs/Observable';
import {Response} from 'angular2/http';

export interface GridServiceInterface {
    find(filter?: LoopBackFilterInterface): Observable<Response>;
    count(where?: any): Observable<Response>;
}