import {Component, View} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {Observable} from 'rxjs/Observable';
import {UserApi as AuthHttp} from '../../lb-services';

@Component({
  selector: 'login'
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES ],
  templateUrl: 'app/module/login/login.html',
  styleUrls: ['app/module/login/login.css']
})
export class Login {

  public cantAuth: boolean = false;

  constructor(public router: Router, public authHttp: AuthHttp) {
  }

  login(event: any, username: string, password: string) {
    event.preventDefault();
    this.authHttp.login({
      username: username,
      password: password
    })
    .subscribe(
      res => {
        this.cantAuth = false;
        this.router.parent.navigate(['Home']);
      },
      err => {
        this.cantAuth = true;
      }
    );
  }
}