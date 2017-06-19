import { User } from '../../app/shared/user/user';
import { Image, Location, UserResponse, UserStats, UserValidations } from '../../app/shared/user/user-response.interface';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../app/shared/item/item';
export const USER_ID: string = 'l1kmzn82zn3p';
export const MICRO_NAME: string = 'String S.';
export const ACCESS_TOKEN: string = 'bS7D7d26UordM5M0uy5o4IisuyrPz35mfxfpw7PLRqQfzouQGXGpQtyZWFRRDdRFFT5fJZ';

export const IMAGE: Image = {
  'id': '9jd7ryx5odjk',
  'legacy_id': 500002512,
  'original_width': 100,
  'original_height': 62,
  'average_hex_color': '6a707b',
  'urls_by_size': {
    'original': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=ORIGINAL',
    'small': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    'large': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    'medium': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320',
    'xlarge': 'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320'
  }
};

export const USER_LOCATION: Location = {
  'id': 101,
  'approximated_latitude': 41.399132621722174,
  'approximated_longitude': 2.17585484411869,
  'city': 'Barcelona',
  'zip': '08009',
  'approxRadius': 0,
  'title': '08009, Barcelona'
};

export const STATS: UserStats = {
  'published': 10,
  'sold': 2,
  'favorites': 0,
  'send_reviews': 2,
  'received_reviews': 1,
  'notification_read_pending': 0,
  'purchased': 0
};

export const VALIDATIONS: UserValidations = {
  'email': false,
  'mobile': false,
  'facebook': false,
  'google_plus': false,
  'gender': false,
  'location': true,
  'picture': true,
  'scoring_stars': 0,
  'level': 1,
  'birthday': true
};

export const VERIFICATION_LEVEL: number = 1;
export const SCORING_STARS: number = 0;
export const SCORING_STARTS: number = 0;
export const RESPONSE_RATE: string = 'Responde en menos de una hora';
export const ONLINE: boolean = false;
export const RECEIVED_REPORTS: number = 3;
export const USER_TYPE: string = 'inactive';
export const USER_WEB_SLUG: string = 'webslug-l1kmzn82zn3p';

export const USER_DATA: UserResponse = {
  'legacy_id': 101,
  'id': USER_ID,
  'micro_name': MICRO_NAME,
  'image': IMAGE,
  'location': USER_LOCATION,
  'stats': STATS,
  'validations': VALIDATIONS,
  'verification_level': VERIFICATION_LEVEL,
  'scoring_stars': SCORING_STARS,
  'scoring_starts': SCORING_STARTS,
  'response_rate': RESPONSE_RATE,
  'online': ONLINE,
  'received_reports': RECEIVED_REPORTS,
  'type': USER_TYPE,
  'web_slug': USER_WEB_SLUG
};

export const MOCK_USER_RESPONSE_BODY: any = {
  'token': ACCESS_TOKEN,
  'resetToken': 'eZXAqOYOyGK9tI4YbwI8Lsd65hs7rIN2mvQVekZ5euFDBBUMDcgJ7jbhTQ325FUA49W1j4',
  'registerInfo': {'userId': 500002515, 'userUUID': USER_ID, 'idUser': 500002515}
};

export const MOCK_USER: User = new User(
  USER_DATA.id,
  USER_DATA.micro_name,
  USER_DATA.image,
  USER_DATA.location,
  USER_DATA.stats,
  USER_DATA.validations,
  USER_DATA.verification_level,
  USER_DATA.scoring_stars,
  USER_DATA.scoring_starts,
  USER_DATA.response_rate,
  USER_DATA.online
);

export const USER_ITEM_DISTANCE: number = 10;

export class MockedUserService {
  public get(url: string): Observable<User> {
    let data: any = USER_DATA;
    return Observable.of(new User(
      data.id,
      data.micro_name,
      data.image,
      data.location,
      data.stats,
      data.validations,
      data.verification_level,
      data.scoring_stars,
      data.scoring_starts,
      data.response_rate,
      data.online
    ));
  }

  public calculateDistanceFromItem(user: User, item: Item): number {
    return USER_ITEM_DISTANCE;
  }

  get user(): User {
    return new User(USER_ID);
  }
}
