import {View, Component} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';

import {LoggedInRouterOutlet} from './LoggedInOutlet';
import {Home} from './module/home/home';
import {Login} from './module/login/login';
import {Signup} from './module/signup/signup';
import {Company} from './module/company/component';

@Component({
  selector: 'app'
})
@View({
  templateUrl: 'app/app.html',
  directives: [ LoggedInRouterOutlet ]
})
@RouteConfig([
  { path: '/', redirectTo: ['Home'] },
  { path: '/home', component: Home, as: 'Home' },
  { path: '/login', component: Login, as: 'Login' },
  { path: '/signup', component: Signup, as: 'Signup' },
  { path: '/company', component: Company, as: 'Company' }
])

export class App {
  constructor(public router: Router) {
  }
}