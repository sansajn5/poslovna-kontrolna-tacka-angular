import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable()
export class ApiService {

    private BASE_URL = 'http://localhost:8001';

    constructor(private http: HttpClient) {}

    getCountries(): Observable<any> {
        return this.http.get(`${this.BASE_URL}/countries`, httpOptions)
    }

    createCountry(data): Observable<any> {
        const body = JSON.stringify(data);
        return this.http.post(`${this.BASE_URL}/countries`, body, httpOptions)
    }

    deleteCountry(id): Observable<any> {
        return this.http.delete(`${this.BASE_URL}/countries/${id}`, httpOptions)
    }

    updateCountry(data) : Observable<any> {
        const id = data._id;
        const body = JSON.stringify({mark:data.mark, name: data.name});
        return this.http.put(`${this.BASE_URL}/countries/${id}`, body, httpOptions)
    }

    getCities(mark) : Observable<any> {
        if(mark != '0')
            return this.http.get(`${this.BASE_URL}/countries/${mark}/cities`, httpOptions)
        else
            return this.http.get(`${this.BASE_URL}/cities`, httpOptions)
    }

    deleteCity(mark, id): Observable<any> {
        if(mark != '0')
            return this.http.delete(`${this.BASE_URL}/countries/${mark}/cities/${id}`, httpOptions)
        else
            return this.http.delete(`${this.BASE_URL}/cities/${id}`, httpOptions)
    }

    addCity(mark, countryId, data) : Observable<any> {
        const body = JSON.stringify(data);
        if(mark != '0')
            return this.http.post(`${this.BASE_URL}/countries/${mark}/cities`,body, httpOptions)
        else
            return this.http.post(`${this.BASE_URL}/cities`,body , httpOptions)
    }

    updateCity(mark, data) : Observable<any> {
        const id = data._id;
        const body = JSON.stringify({name:data.name, postalCode: data.postalCode, country: data.country});
        if(mark != '0')
            return this.http.put(`${this.BASE_URL}/countries/${mark}/cities/${id}`,body, httpOptions)
        else
            return this.http.put(`${this.BASE_URL}/cities/${id}`,body , httpOptions)
    }


}