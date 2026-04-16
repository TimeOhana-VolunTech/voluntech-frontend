import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ong, OngRequest } from '../models/ong.model';
//import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OngService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/ongs';
  //private readonly API = `${environment.apiUrl}/ongs`;

  cadastrar(ong: OngRequest) {
    return this.http.post<Ong>(this.API, ong);
  }

  listar() {
    return this.http.get<Ong[]>(this.API);
  }
}
