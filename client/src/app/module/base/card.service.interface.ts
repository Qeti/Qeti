import {Observable} from 'rxjs/Observable';
import {Response} from 'angular2/http';

export interface CardServiceInterface {
    create(data: any): Observable<Response>;
}