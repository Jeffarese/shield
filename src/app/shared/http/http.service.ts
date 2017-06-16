import { Injectable } from '@angular/core';
import {
  Http, RequestOptions, ConnectionBackend, Response, Headers,
  URLSearchParams, RequestOptionsArgs
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class HttpService extends Http {

  private _accessToken: string;

  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
    super(backend, defaultOptions);
  }

  public request(url: string, options?: RequestOptionsArgs): Observable<Response> {
    options = this.getOptions(options);
    return super.request(url, options);
  };

  public get(url: string, params?: any, options?: RequestOptionsArgs): Observable<Response> {
    url = this.buildUrl(url, params);
    options = this.getOptions(options);
    return super.get(url, options);
  }

  public postUrlEncoded(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    options = options || new RequestOptions();
    options.headers = options.headers || new Headers();
    options.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options = this.getOptions(options);
    body = this.urlEncode(body);
    return this.post(url, body, options);
  };

  public post(url: string, body?: any, options?: RequestOptionsArgs): Observable<Response> {
    url = this.buildUrl(url);
    options = this.getOptions(options);
    return super.post(url, body, options);
  };

  public postNoBase(url: string, body?: any, authorization?: string): Observable<Response> {
    let headers: Headers = new Headers();
    headers.append('Authorization', authorization);
    let newOptions: RequestOptions = new RequestOptions({headers: headers});
    return super.post(url, body, newOptions);
  };

  public put(url: string, body?: any, options?: RequestOptionsArgs): Observable<Response> {
    url = this.buildUrl(url);
    options = this.getOptions(options);
    return super.put(url, body, options);
  };

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.buildUrl(url);
    options = this.getOptions(options);
    return super.delete(url, options);
  };

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    url = this.buildUrl(url);
    options = this.getOptions(options);
    return super.patch(url, body, options);
  };

  public head(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.buildUrl(url);
    options = this.getOptions(options);
    return super.head(url, options);
  };

  public options(url: string, options?: RequestOptionsArgs): Observable<Response> {
    url = this.buildUrl(url);
    options = this.getOptions(options);
    return super.options(url, options);
  };

  public storeAccessToken(accessToken: string): void {
    localStorage.setItem('access_token', accessToken);
  }

  public deleteAccessToken() {
    localStorage.removeItem('access_token');
    this._accessToken = null;
  }

  get accessToken(): string {
    if (!this._accessToken) {
      let accessToken: string = localStorage.getItem('access_token');
      if (accessToken) {
        this._accessToken = accessToken;
      }
    }
    return this._accessToken;
  }

  private buildUrl(url: string, params?: any): string {
    url = environment['baseUrl'] + url;
    params = this.toQueryString(params);
    if (params) {
      url += '?' + params;
    }
    return url;
  }

  private urlEncode(obj: Object): string {
    let urlSearchParams: URLSearchParams = new URLSearchParams();
    for (let key in obj) {
      /* istanbul ignore else  */
      if (obj.hasOwnProperty(key)) {
        urlSearchParams.append(key, obj[key]);
      }
    }
    return urlSearchParams.toString();
  }

  private getOptions(options: RequestOptionsArgs): RequestOptions {
    let headers: Headers = new Headers();
    if (this.accessToken) {
      headers.append('Authorization', 'Bearer ' + this.accessToken);
      if (environment['bypass']) {
        headers.append('X-Bypass-Signature', environment['bypass']);
      }
    }
    let newOptions: RequestOptions = new RequestOptions({headers: headers});
    if (options && options.headers) {
      options.headers.forEach(function (values: string[], name: string) {
        headers.append(name, values[0]);
      });
      newOptions = (<RequestOptions>options).merge(newOptions);
    }
    return newOptions;
  }

  private toQueryString(params: any) {
    let encodedStr: string = '';
    for (let key in params) {
      /* istanbul ignore else  */
      if (params.hasOwnProperty(key)) {
        if (encodedStr && encodedStr[encodedStr.length - 1] !== '&') {
          encodedStr = encodedStr + '&';
        }
        let value: any = params[key];
        if (value instanceof Array) {
          for (let i: number = 0; i < value.length; i++) {
            encodedStr = encodedStr + key + '=' + encodeURIComponent(value[i]) + '&';
          }
        } else if (typeof value === 'object') {
          for (let innerKey in value) {
            if (value.hasOwnProperty(innerKey) && typeof value[innerKey] !== 'undefined') {
              encodedStr = encodedStr + key + '[' + innerKey + ']=' + encodeURIComponent(value[innerKey]) + '&';
            }
          }
        } else {
          if (typeof value !== 'undefined') {
            encodedStr = encodedStr + key + '=' + encodeURIComponent(value);
          }
        }
      }
    }
    if (encodedStr[encodedStr.length - 1] === '&') {
      encodedStr = encodedStr.substr(0, encodedStr.length - 1);
    }
    return encodedStr;
  }

}
