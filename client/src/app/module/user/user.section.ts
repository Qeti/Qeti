import {Component, View} from 'angular2/core';
import {RouteConfig, Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {UserApi} from '../../lb-services';
import {UserList} from '../user/user.list';
import {UserCreate} from '../user/user.create';
import {LoggedInRouterOutlet} from '../../LoggedInOutlet';

@Component({
  selector: 'company-section',
  host: { 'class': 'section' },
})
@View({
  directives: [RouterLink, LoggedInRouterOutlet, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/module/base/base.section.html'
})
@RouteConfig([
  { path: '/', as: 'UserList', component: UserList, useAsDefault: true },
  { path: '/create', as: 'Create', component: UserCreate }
  //{ path: '/edit/:id', as: 'edit',   component: EditBook },
  //{ path: '/view/:id', as: 'view',   component: ViewBook }
])
export class UserSection {
  constructor(public router: Router, public authHttp: UserApi) {
  }
}