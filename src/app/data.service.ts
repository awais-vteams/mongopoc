import {Injectable} from '@angular/core';

import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  result: any;

  constructor(private _http: Http) {
  }

  getCount(params) {
    return this._http.get('/api/count', {params: {data: JSON.stringify(params)}})
      .map(result => this.result = result.json().data);
  }

  getStates() {
    return this._http.get('/api/states')
      .map(result => this.result = result.json().data);
  }

}
