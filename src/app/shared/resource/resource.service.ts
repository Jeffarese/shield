import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs/Observable';
import { Model } from './model.interface';
import { ApiResponse } from './api-response.interface';
import { Response } from '@angular/http';

@Injectable()
export abstract class ResourceService {

  protected abstract API_URL_V2: string;
  protected store: any = {};
  private observables: any = {};

  constructor(protected http: HttpService) {
  }

  protected abstract mapRecordData(r: ApiResponse): Model;

  public get(id: string, noCache?: boolean): Observable<Model> {
    if (this.store[id] && !noCache) {
      return Observable.of(this.store[id]);
    } else if (this.observables[id]) {
      return this.observables[id];
    } else {
      this.observables[id] = this.http.get(this.API_URL_V2 + `/${id}`)
      .map((r: Response) => r.json())
      .map((r: ApiResponse) => {
        if (r.id) {
          return this.mapRecordData(r);
        }
        return null;
      })
      .map((model: Model) => this.addToStore(model, id))
      .share();
      return this.observables[id];
    }
  }

  private addToStore(model: Model, id: string): Model {
    if (model) {
      this.store[id] = model;
    }
    delete this.observables[id];
    return model;
  }

}
