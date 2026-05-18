import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ong, OngRequest } from '../models/ong.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OngService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/ongs`;

  cadastrar(ong: OngRequest) {
    return this.http.post<Ong>(this.API, ong);
  }

  listar() {
    return this.http.get<Ong[]>(this.API);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  atualizar(id: number, dadosAtualizados: any): Observable<any> {
    return this.http.put<any>(`${this.API}/${id}`, dadosAtualizados);
  }
}
