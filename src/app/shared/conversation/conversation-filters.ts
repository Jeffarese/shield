import { Filter } from './filter.interface';

export class Filters {

  public static MEETINGS: Filter[] = [{
    key: 'phone',
    value: undefined
  }, {
    key: 'expectedVisit',
    value: true
  }];

  public static OTHERS: Filter[] = [{
    key: 'phone',
    value: undefined
  }, {
    key: 'expectedVisit',
    value: false
  }];

  public static NO_PHONE: Filter[] = [{
    key: 'phone',
    value: undefined
  }];

}
