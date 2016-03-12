import {Component, View} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {UserApi} from '../../lb-services';

@Component({
  selector: 'app-menu'
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES ],
  templateUrl: 'app/module/menu/menu.html'
})
export class Menu {

  constructor(public router: Router, public authHttp: UserApi) {
  }
  
  public isAuthenticated() {
    return this.authHttp.isAuthenticated();
  }

  logout() {
    this.authHttp
      .logout()
      .subscribe(
        () => {
          this.router.parent.navigate(['Login']);
        },
        () => {
          this.router.parent.navigate(['Login']);
        }
      );
  }
}