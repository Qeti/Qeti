import {Component, View} from 'angular2/core';
import {Router, RouterLink} from 'angular2/router';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {UserApi as AuthHttp} from '../../lb-services';

@Component({
  selector: 'signup'
})
@View({
  directives: [ RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES ],
  templateUrl: 'app/module/signup/signup.html',
  styleUrls: ['app/module/signup/signup.css']
})
export class Signup {
  constructor(public router: Router, public authHttp: AuthHttp) {
  }

  signup(event: any, username: string, password: string) {
    event.preventDefault();
    this.authHttp
      .create({
        username: username,
        password: password
      })
      .subscribe(
        () => {
          this.router.parent.navigate(['Home']);
        },
        error => {
          alert(error.text());
          console.log(error.text());
        }
      );
  }

}
