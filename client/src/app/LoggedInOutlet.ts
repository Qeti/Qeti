import {Directive, Attribute, ElementRef, DynamicComponentLoader} from 'angular2/core';
import {Router, RouterOutlet, ComponentInstruction} from 'angular2/router';
import {UserApi as AuthHttp} from './lb-services';

@Directive({
  selector: 'router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: any = {
    'login': true,
    'signup': true
  };

  constructor(
    _elementRef: ElementRef, 
    _loader: DynamicComponentLoader,
    private parentRouter: Router, 
    @Attribute('name') nameAttr: string, 
    public authHttp: AuthHttp
  ) {
    super(_elementRef, _loader, parentRouter, nameAttr);
  }

  activate(instruction: ComponentInstruction) {
    var path = instruction.urlPath;
    if (!this.publicRoutes[path] && !this.authHttp.isAuthenticated()) {
      this.parentRouter.navigate(['Login']);
    }
    return super.activate(instruction);
  }
}