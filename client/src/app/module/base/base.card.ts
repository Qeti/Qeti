import {Config} from '../../config';
import {CardServiceInterface} from './card.service.interface';

export class BaseCard {

  constructor(protected service: CardServiceInterface, protected config: Config) {
  }
  
  public addRecord(event: any, username: string, email: string) {
    event.preventDefault();
    this.service
      .create({
          username: username,
          email: email
      })
      .subscribe(
        () => {
          console.log('ok')
        },
        () => {
          console.log('error')
        }
      );
  }
  
}
