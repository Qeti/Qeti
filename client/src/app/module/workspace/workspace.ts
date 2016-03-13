import {Component, View} from 'angular2/core';
import {RouteConfig, Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {UserApi} from '../../lb-services';
import {Menu} from '../menu/menu';
import {CompanySection} from '../company/company.section';
import {UserSection} from '../user/user.section';
import {LoggedInRouterOutlet} from '../../LoggedInOutlet';

@Component({
  selector: 'workspace'
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES, LoggedInRouterOutlet, Menu],
  templateUrl: 'app/module/workspace/workspace.html'
})
@RouteConfig([
  { path: '/companies/...', component: CompanySection, as: 'CompanySection', useAsDefault: true },
  { path: '/users/...', component: UserSection, as: 'UserSection' }
])
export class Workspace {
  constructor(public router: Router, public authHttp: UserApi) {
  }
}