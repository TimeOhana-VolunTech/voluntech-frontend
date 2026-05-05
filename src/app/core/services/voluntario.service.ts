import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Voluntario, VoluntarioRequest } from '../models/voluntario.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria } from '../models/enums/categoria.enum';

@Injectable({ providedIn: 'root' })
export class VoluntarioService {
  private http = inject(HttpClient);
  //private readonly API = 'http://localhost:8080/voluntarios';
  private readonly API = `${environment.apiUrl}/voluntarios`;

  cadastrar(dados: VoluntarioRequest): Observable<Voluntario> {
    return this.http.post<Voluntario>(this.API, dados);
  }

  listar(): Observable<Voluntario[]> {
    return this.http.get<Voluntario[]>(this.API);
  }

  atualizarPerfil(id: number, dados: any): Observable<Voluntario> {
    return this.http.put<Voluntario>(`${this.API}/${id}`, dados);
  }

  buscarPorId(id: number): Observable<Voluntario> {
    return this.http.get<Voluntario>(`${this.API}/${id}`);
  }

}
