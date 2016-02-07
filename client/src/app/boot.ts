import {bootstrap}    from 'angular2/platform/browser'
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './app.component'
import {Config} from './config';
import {CompanyApi, UserApi} from './lb-services';

bootstrap(AppComponent, [HTTP_PROVIDERS, Config, CompanyApi, UserApi]);
