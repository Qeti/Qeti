import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {RouterLink} from 'angular2/router';
import {UserApi} from '../../lb-services';
import {BaseCard} from '../base/base.card';
import {Config} from '../../config';

@Component({
  selector: 'company-create',
  providers: [UserApi]
})
@View({
  directives: [RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/module/base/base.card.html'
})
export class UserCreate extends BaseCard {

  constructor(protected service: UserApi, protected config: Config) {
    super(service, config);
  }
}
