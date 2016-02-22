import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {UserApi as AuthHttp} from '../../lb-services';
import {Router, RouterLink} from 'angular2/router';

@Component({
  selector: 'home'
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES],
  templateUrl: 'app/module/home/home.html',
  styleUrls: ['app/module/home/home.css']
})
export class Home {

  constructor(public router: Router, public authHttp: AuthHttp) {
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
