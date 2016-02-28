import {Component, View} from 'angular2/core';
import {RouteConfig, Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {UserApi as AuthHttp} from '../../lb-services';
import {Menu} from '../menu/menu';
import {Company} from '../company/component';
import {User} from '../user/component';
import {LoggedInRouterOutlet} from '../../LoggedInOutlet';

@Component({
  selector: 'workspace'
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES, LoggedInRouterOutlet, Menu],
  templateUrl: 'app/module/workspace/workspace.html'
})
@RouteConfig([
  { path: '/company', component: Company, as: 'Company', useAsDefault: true },
  { path: '/user', component: User, as: 'User' }
])
export class Workspace {
  constructor(public router: Router, public authHttp: AuthHttp) {
  }
}