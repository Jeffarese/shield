import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { User } from './user';
import { Observable } from 'rxjs/Observable';
import { EventService } from '../event/event.service';
import { ResourceService } from '../resource/resource.service';
import { HaversineService, GeoCoord } from 'ng2-haversine';
import { Item } from '../item/item';
import { LoginResponse } from './login-response.interface';
import { Response } from '@angular/http';
import { UserResponse } from './user-response.interface';
import { BanReason } from '../item/ban-reason.interface';
import { I18nService } from '../i18n/i18n.service';

@Injectable()
export class UserService extends ResourceService {

  public queryParams: any = {};
  private API_URL_V1: string = 'shnm-portlet/api/v1/access.json/loginProfessional';
  protected API_URL_V2: string = 'api/v2/users';
  protected API_URL_V3: string = 'api/v3/users';
  private banReasons: BanReason[] = null;
  private _user: User;
  private meObservable: Observable<User>;

  constructor(http: HttpService,
              private event: EventService,
              private i18n: I18nService,
              private haversineService: HaversineService) {
    super(http);
  }

  get user(): User {
    return this._user;
  }

  public login(data: any): Observable<LoginResponse> {
    return this.http.postUrlEncoded(
      this.API_URL_V1,
      data,
    )
    .map((r: Response) => r.json())
    .map((r: LoginResponse) => this.storeData(r));
  }

  public logout() {
    this.http.deleteAccessToken();
    this.event.emit(EventService.USER_LOGOUT);
  }

  public get isLogged(): boolean {
    return this.http.accessToken ? true : false;
  }

  public get(id: string, noCache?: boolean): Observable<User> {
    return super.get(id, noCache).catch(() => {
      return Observable.of(this.getFakeUser(id));
    });
  }

  public getFakeUser(id: string): User {
    return new User(id, 'No disponible');
  }

  public me(): Observable<User> {
    if (this._user) {
      return Observable.of(this._user);
    } else if (this.meObservable) {
      return this.meObservable;
    }
    this.meObservable = this.http.get(this.API_URL_V2 + '/me')
    .map((r: Response) => r.json())
    .map((r: UserResponse) => this.mapRecordData(r))
    .map((user: User) => {
      this._user = user;
      return user;
    }).share();
    return this.meObservable;
  }

  public checkUserStatus() {
    if (this.isLogged) {
      this.event.emit(EventService.USER_LOGIN, this.http.accessToken);
    }
  }

  public calculateDistanceFromItem(user: User, item: Item): number {
    if (!user.location || !item.location) {
      return null;
    }
    let itemCoord: GeoCoord = {
      latitude: item.location.approximated_latitude,
      longitude: item.location.approximated_longitude,
    };
    let userCoord: GeoCoord = {
      latitude: user.location.approximated_latitude,
      longitude: user.location.approximated_longitude,
    };
    return this.haversineService.getDistanceInKilometers(itemCoord, userCoord);
  }

  public syncStatus(user: User) {
    this.get(user.id, true).subscribe((updatedUser: User) => {
      user.online = updatedUser.online;
    });
  }

  private storeData(data: LoginResponse): LoginResponse {
    this.http.storeAccessToken(data.token);
    this.event.emit(EventService.USER_LOGIN, data.token);
    return data;
  }

  public getBanReasons(): Observable<BanReason[]> {
    if (!this.banReasons) {
      this.banReasons = this.i18n.getTranslations('reportUserReasons');
    }
    return Observable.of(this.banReasons);
  }

  public reportUser(userId: string,
                    itemId: number,
                    comments: string,
                    reason: number,
                    conversationId: number): Observable < any > {

    let data: any = {
      itemId: itemId,
      comments: comments,
      reason: reason,
      conversationId: conversationId,
    };
    return this.http.post(this.API_URL_V3 + '/me/report/user/' + userId, data);
  }

  protected mapRecordData(data: UserResponse): User {
    return new User(
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
      data.online,
      data.type,
      data.received_reports,
      data.web_slug
    );
  }
}


