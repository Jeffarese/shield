import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../i18n/i18n.service';

@Pipe({
  name: 'callStatusLabel'
})
export class CallStatusLabelPipe implements PipeTransform {

  constructor(private i18n: I18nService) {
  }

  transform(callStatus: string = 'SHARED'): any {
    return this.i18n.getTranslations(callStatus.toLocaleLowerCase());
  }

}
