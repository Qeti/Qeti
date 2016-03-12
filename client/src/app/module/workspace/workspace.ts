import {Component, View} from 'angular2/core';
import {RouteConfig, Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {UserApi} from '../../lb-services';
import {Menu} from '../menu/menu';
import {CompanyGrid} from '../company/company';
import {UserGrid} from '../user/user';
import {LoggedInRouterOutlet} from '../../LoggedInOutlet';

@Component({
  selector: 'workspace'
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES, LoggedInRouterOutlet, Menu],
  templateUrl: 'app/module/workspace/workspace.html'
})
@RouteConfig([
  { path: '/company', component: CompanyGrid, as: 'Company', useAsDefault: true },
  { path: '/user', component: UserGrid, as: 'User' }
])
export class Workspace {
  constructor(public router: Router, public authHttp: UserApi) {
  }
}