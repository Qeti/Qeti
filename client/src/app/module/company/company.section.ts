import {Component, View} from 'angular2/core';
import {RouteConfig, Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {UserApi} from '../../lb-services';
import {CompanyList} from '../company/company.list';
import {CompanyCreate} from '../company/company.create';
import {LoggedInRouterOutlet} from '../../LoggedInOutlet';

@Component({
  selector: 'company-section',
  host: { 'class': 'section' },
})
@View({
  directives: [RouterLink, LoggedInRouterOutlet, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/module/company/company.section.html'
})
@RouteConfig([
  { path: '/', as: 'CompanyList', component: CompanyList, useAsDefault: true },
  { path: '/create', as: 'Create', component: CompanyCreate }
  //{ path: '/edit/:id', as: 'edit',   component: EditBook },
  //{ path: '/view/:id', as: 'view',   component: ViewBook }
])
export class CompanySection {
  constructor(public router: Router, public authHttp: UserApi) {
  }
}